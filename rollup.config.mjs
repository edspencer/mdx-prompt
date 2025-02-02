// rollup.config.mjs
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'esm',
        sourcemap: true
      },
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'auto'
      }
    ],
    // If you have *extra* things to exclude that aren't in peerDeps,
    // you can still set external: ['fs', 'path', ...], but typically not needed:
    // external: ['fs', 'path'],

    plugins: [
      // 1) This plugin automatically externalizes anything in peerDependencies
      peerDepsExternal(),
      // 2) Normal rollup plugins
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  }
];
