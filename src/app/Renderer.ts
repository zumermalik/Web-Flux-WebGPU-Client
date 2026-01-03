import shaderCode from '../shaders/basic.wgsl?raw';

export class Renderer {
    private canvas: HTMLCanvasElement;
    private adapter: GPUAdapter | null = null;
    private device: GPUDevice | null = null;
    private context: GPUCanvasContext | null = null;
    private pipeline: GPURenderPipeline | null = null;
    private uniformBuffer: GPUBuffer | null = null;
    private format: GPUTextureFormat = 'bgra8unorm';

    // State to render
    private intensity: number = 1.0;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    async init() {
        if (!navigator.gpu) {
            throw new Error("WebGPU not supported on this browser.");
        }

        this.adapter = await navigator.gpu.requestAdapter();
        if (!this.adapter) throw new Error("No GPUAdapter found.");

        this.device = await this.adapter.requestDevice();
        this.context = this.canvas.getContext('webgpu') as GPUCanvasContext;

        this.format = navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: 'premultiplied',
        });

        await this.createPipeline();
        this.createUniformBuffer();
        
        requestAnimationFrame(() => this.render());
    }

    private async createPipeline() {
        if (!this.device) return;

        const shaderModule = this.device.createShaderModule({
            code: shaderCode
        });

        // Layout for uniforms
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: { type: 'uniform' }
            }]
        });

        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });

        this.pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: shaderModule,
                entryPoint: 'vs_main',
            },
            fragment: {
                module: shaderModule,
                entryPoint: 'fs_main',
                targets: [{ format: this.format }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        });
    }

    private createUniformBuffer() {
        if (!this.device) return;
        
        // 2 floats: intensity (f32), time (f32) -> 8 bytes, aligned to 16
        const bufferSize = 16; 
        this.uniformBuffer = this.device.createBuffer({
            size: bufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    }

    public updateData(intensity: number) {
        this.intensity = intensity;
    }

    private render() {
        if (!this.device || !this.context || !this.pipeline || !this.uniformBuffer) return;

        // Update Uniforms
        const uniformData = new Float32Array([this.intensity, performance.now() / 1000]);
        this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData);

        const commandEncoder = this.device.createCommandEncoder();
        const textureView = this.context.getCurrentTexture().createView();

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [{
                view: textureView,
                clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store',
            }],
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.pipeline);
        
        // Create bind group dynamically (or cache it)
        const bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: { buffer: this.uniformBuffer }
            }]
        });
        
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(3); // Draw 3 vertices
        passEncoder.end();

        this.device.queue.submit([commandEncoder.finish()]);

        requestAnimationFrame(() => this.render());
    }
}