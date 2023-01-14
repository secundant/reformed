/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    lib: {
      formats: ['es', 'cjs'],
      entry: 'index.ts'
    },
    rollupOptions: {
      external: ['effector', 'patronum']
    }
  },
  test: { typecheck: { ignoreSourceErrors: true }, passWithNoTests: true },
  plugins: [tsconfigPaths()]
});
