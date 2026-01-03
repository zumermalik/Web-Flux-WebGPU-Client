import { mat4, vec3 } from 'gl-matrix';

// Create a perspective projection matrix (Field of View)
export function createPerspectiveMatrix(aspectRatio: number): Float32Array {
    const fieldOfView = (45 * Math.PI) / 180;   // in radians
    const zNear = 0.1;
    const zFar = 100.0;
    
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspectRatio, zNear, zFar);

    return projectionMatrix as Float32Array;
}

// Create a transformation matrix to move objects
export function createModelMatrix(rotation: number): Float32Array {
    const modelMatrix = mat4.create();
    
    // Reset to identity
    mat4.identity(modelMatrix);
    
    // Translate back slightly so we can see it
    mat4.translate(modelMatrix, modelMatrix, [-0.0, 0.0, -3.0]);
    
    // Rotate based on time/input
    mat4.rotate(modelMatrix, modelMatrix, rotation, [0, 0, 1]); // Rotate Z
    mat4.rotate(modelMatrix, modelMatrix, rotation * 0.7, [0, 1, 0]); // Rotate Y

    return modelMatrix as Float32Array;
}