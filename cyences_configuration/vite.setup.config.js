import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
 
export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin(), tailwindcss()],
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'src/cs_configuration.jsx'),
      output: {
        format: 'iife',
        name: 'ProductConfiguration',
        entryFileNames: 'cs_configuration.js',
        dir: path.resolve(__dirname, '../cyences_app_for_splunk/appserver/static/js/build'),
        inlineDynamicImports: true,
      },
    },
    sourcemap: true, //temp
    minify: false,   //temp
  },
});