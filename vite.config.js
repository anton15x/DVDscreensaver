import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({}),
    checker({ typescript: true }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      formats: ['umd'],
      name: "DVDscreensaver",
    },
  },
  server: {
    open: 'demo/index.html',
  },
});
