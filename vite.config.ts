import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  // Plugin to handle .wgsl files as raw strings
  assetsInclude: ['**/*.wgsl'] 
});