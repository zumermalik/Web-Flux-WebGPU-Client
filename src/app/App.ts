import { Renderer } from './Renderer';
import { Client } from './Client';

export class App {
    private renderer: Renderer;
    private client: Client;

    constructor() {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        
        // 1. Initialize Renderer
        this.renderer = new Renderer(canvas);
        this.renderer.init().then(() => {
            console.log("Renderer initialized");
        }).catch(err => {
            console.error("Renderer failed", err);
        });

        // 2. Initialize Client
        this.client = new Client((data: any) => {
            // When data arrives from WebFlux, update the GPU Renderer
            if (data && typeof data.value === 'number') {
                this.renderer.updateData(data.value);
            }
        });

        // 3. Connect (Use a real URL if backend exists, otherwise mock)
        // this.client.connect('http://localhost:8080/stream');
        this.client.mockDataStream(); 
    }
}