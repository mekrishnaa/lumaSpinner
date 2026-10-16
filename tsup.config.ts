import { defineConfig } from 'tsup';
export default defineConfig({
  entry: { index: 'src/index.ts', styles: 'src/styles/lumaspinner.css' },
  format: ['esm', 'cjs'],
  dts: { entry: ['src/index.ts'] },
  sourcemap: false,
  clean: true,
  treeshake: true,
  minify: true,
  esbuildOptions(options) {
    options.legalComments = 'none';
  },
  outDir: 'dist',
});

