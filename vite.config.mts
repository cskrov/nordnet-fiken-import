import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		svelte(),
		Icons({ compiler: 'svelte' })
	],
});
