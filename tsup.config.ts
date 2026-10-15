import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    loaders: 'src/loaders/index.ts',
    styles: 'src/styles/lumaspinner.css',
  },
  format: ['esm', 'cjs'],
  dts: { entry: ['src/index.ts', 'src/loaders/index.ts'] },
  sourcemap: false,
  clean: true,
  treeshake: true,
  minify: true,
  outDir: 'dist',
});
