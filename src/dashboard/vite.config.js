import { defineConfig } from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ viteSingleFile(), svelte()],
  build: {
		cssCodeSplit: false,
		assetsInlineLimit: 100000000,
		rollupOptions: {
      output: {
        inlineDynamicImports: false,
        manualChunks: () => "everything.js",
			},
		},
	},
})
