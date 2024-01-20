import * as path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({}),
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
