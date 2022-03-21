import pluginTypescript from "@rollup/plugin-typescript";
// import { babel } from '@rollup/plugin-babel';
// import commonjs from '@rollup/plugin-commonjs';
// import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
//import { terser } from 'rollup-plugin-terser';
import clear from 'rollup-plugin-clear';

const input = [
  'lib/draw.ts',
  'lib/text.ts',
  'lib/grid.ts',
  'lib/index.ts',
];
const fileName = 'canvas-datagrid';

const babelInput = {
  babelHelpers: 'bundled',
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        useBuiltIns: 'entry',
        modules: false,
        spec: true,
        targets: '> 0.25%, not dead',
      },
    ],
  ],
};
export default {
  input,
  testPathIgnorePatterns: ['node_modules/'],
  plugins: [
    pluginTypescript(),
    // commonjs({
    //   extensions: [".js", ".ts"],
    // }),
    clear({ targets: ['dist'] }),
    // replace({
    //   'window.EXCLUDE_GLOBAL': 'true',
    // }),
    nodeResolve(),
    // babel(babelInput),
  ],
  output: {
    //file: `dist/bundle.module.js`,
    dir: 'dist',
    //plugins: [terser()],
    sourcemap: true,
  },
};
