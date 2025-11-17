import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'], // ES modules for modern Node.js
  target: 'node18', // Minimum Node.js version
  platform: 'node',
  splitting: false, // Single file for backend simplicity
  sourcemap: true,
  minify: false, // Keep readable for debugging
  clean: true, // Clean dist folder before build
  dts: false, // No type definitions needed for backend
  esbuildOptions: options => {
    // Don't bundle these - keep them as external dependencies
    options.external = ['axios', 'cors', 'express', 'node-cache']
    return options
  },
})
