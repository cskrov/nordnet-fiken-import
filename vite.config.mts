import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), solidPlugin(), tailwindcss(), Icons({ compiler: 'solid' })],
  server: {
    port: 5173,
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.VERSION ?? 'local'),
  },
  build: {
    target: 'esnext',
  },
});
