import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import svgr from '@svgr/rollup'
import scss from 'rollup-plugin-scss'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true      
    }
  ],
  plugins: [
    external(),
    url(),
    svgr(),
    //scss(),
    postcss({
      modules: false,
      extract: true
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: [ 'external-helpers' ]
    }),
    resolve({ extensions: [ '.mjs', '.js', '.jsx', '.json'] }),  // Default: [ '.mjs', '.js', '.json', '.node' ]
    commonjs(),
    
  ]
}
