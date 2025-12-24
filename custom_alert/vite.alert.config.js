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
      input: path.resolve(__dirname, 'src/cs_custom_alert_create.jsx'),
      output: {
        format: 'iife',
        name: 'CustomAlertCreate',
        entryFileNames: 'cs_custom_alert_create.js',
        dir: path.resolve(__dirname, '../cyences_app_for_splunk/appserver/static/js/build'),
        inlineDynamicImports: true,
      },
    },
    sourcemap: false,
    minify: true,   
  },
});