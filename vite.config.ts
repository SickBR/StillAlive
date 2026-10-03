import { defineConfig } from 'vite';
export default defineConfig({ base: './', cacheDir:'.vite-cache', server:{port:5183,strictPort:true},preview:{port:4183,strictPort:true}, build: { chunkSizeWarningLimit: 1600 } });
