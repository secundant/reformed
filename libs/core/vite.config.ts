/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    minify: true,
    lib: {
      formats: ['es', 'cjs'],
      entry: 'index.ts',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['effector']
    }
  },
  test: { typecheck: { ignoreSourceErrors: false }, passWithNoTests: true },
  plugins: [tsconfigPaths()]
});
