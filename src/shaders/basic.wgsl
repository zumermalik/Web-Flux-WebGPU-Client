struct Uniforms {
    color_intensity: f32,
    time: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(@builtin(vertex_index) VertexIndex : u32) -> @builtin(position) vec4<f32> {
    var pos = array<vec2<f32>, 3>(
        vec2<f32>( 0.0,  0.5),
        vec2<f32>(-0.5, -0.5),
        vec2<f32>( 0.5, -0.5)
    );

    return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}

@fragment
fn fs_main() -> @location(0) vec4<f32> {
    // Dynamic color based on the uniform sent from the WebFlux client
    return vec4<f32>(1.0 * uniforms.color_intensity, 0.5, 0.2, 1.0);
}