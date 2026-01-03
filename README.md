# Web-Flux WebGPU Client (v0 Prototype)

> **Status:** 🚧 Pre-Alpha / Experimental
> **Current Version:** v0.1

This is a bare-bones architectural skeleton designed to demonstrate high-performance real-time data visualization. It establishes the "plumbing" required to stream data from a reactive backend (Spring WebFlux) and render it directly on the GPU (WebGPU), bypassing standard DOM overhead.

## 🎯 Project Goal
To create a pipeline where high-frequency market or scientific data is pushed from a server and visualized instantly with hardware acceleration.

**The Loop:**
`Backend (Stream)` -> `Client (Listener)` -> `Renderer (GPU)` -> `Screen`

---

## 🏗️ Architecture & File Structure

The project is structured to separate **Data Fetching** (CPU task) from **Data Rendering** (GPU task).

### 1. The Core Logic (`src/app/`)
This is where the custom logic lives.

* **`App.ts` ( The Boss )**
    * **Role:** Orchestrator.
    * **Function:** It starts the Renderer, waits for it to be ready, then starts the Client. It acts as the bridge, passing data from the Client callback into the Renderer's state.

* **`Client.ts` ( The Ear )**
    * **Role:** Network Handler.
    * **Function:** Connects to a `Server-Sent Events` (SSE) stream.
    * **Current State:** Includes a `mockDataStream()` function to simulate incoming server data (random float values) since the backend is not connected yet.

* **`Renderer.ts` ( The Painter )**
    * **Role:** WebGPU Manager.
    * **Function:**
        * Talks to the GPU via `navigator.gpu`.
        * Creates the **Pipeline** (how to draw).
        * Manages the **Uniform Buffer** (memory shared between JS and GPU).
        * Runs the `render()` loop (60fps).

### 2. The Shaders (`src/shaders/`)
* **`basic.wgsl`**
    * Written in **WGSL** (WebGPU Shading Language).
    * Runs strictly on the graphics card.
    * **Vertex Stage:** Places geometry (currently a simple triangle).
    * **Fragment Stage:** Colors pixels based on the "Intensity" value sent from the `Client`.

### 3. Utilities (`src/utils/`)
* **`math.ts`**
    * Wrappers for `gl-matrix`.
    * Prepares projection matrices to eventually move from 2D shapes to 3D visualization.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (Installed)
* **Browser:** Chrome 113+ or Edge (WebGPU support is required).
* **Disk Space:** Ensure you have ~200MB free for dependencies.

### Installation

1.  **Install Dependencies** (Downloads Vite, TypeScript, and gl-matrix):
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    Click the link provided in the terminal (usually `http://localhost:5173`).

---

## 🛠 Troubleshooting Common Errors

| Error | Cause | Solution |
| :--- | :--- | :--- |
| `'vite' is not recognized` | `npm install` was not run. | Run `npm install` first to download the tools. |
| `WebGPU not supported` | Old Browser or Firefox/Safari. | Use the latest Google Chrome or MS Edge. |
| `Error reading history file` | Disk full. | Clear disk space or move project to StackBlitz. |

---

## 🔮 Roadmap (v1)

* [ ] **Backend Integration:** Replace mock data with real Spring WebFlux SSE connection.
* [ ] **3D Upgrade:** Use `math.ts` to rotate a 3D Cube instead of a 2D triangle.
* [ ] **Visual Polish:** Add a "tail" or history graph to visualize the data stream over time.
