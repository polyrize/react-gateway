import path from 'path'
import glob from 'glob'
import {fileURLToPath} from 'node:url'
import * as fs from 'fs'
import {defineConfig} from 'vite'
import resolveNode from '@rollup/plugin-node-resolve'
import dts from 'vite-plugin-dts'

import tsConfig from './tsconfig.json' assert {type: 'json'}

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'))

const getExternalLibs = (pkg) => {
  const {dependencies, peerDependencies} = pkg
  return [...Object.keys(dependencies).map((dependency) => new RegExp(dependency)), ...Object.keys(peerDependencies), /node_modules/, 'react/jsx-runtime']
}

export default defineConfig({
  resolve: {
    // add a default extension for ESM imports
    mainFields: ['module', 'main', 'browser'],
    extensions: ['.js', '.mjs', '.ts', '.jsx', '.tsx']
  },
  build: {
    lib: {
      entry: glob.sync('src/**/*.{tsx,jsx,js,ts}'),
      fileName: '[name]'
    },
    emptyOutDir: true,
    rollupOptions: {
      external: getExternalLibs(packageJson),
      input: Object.fromEntries(
        glob.sync('src/**/*.{jsx,tsx,js,ts}').map(file => {
          return [
            path.relative(
              'src',
              file.slice(0, file.length - path.extname(file).length)
            ),
            fileURLToPath(new URL(file, import.meta.url))
          ]
        })
      ),
      output: {
        preserveModules: true,
        dir: './dist',
        format: 'es',
        exports: 'named'
      }
    }
  },
  plugins: [
    dts({
      compilerOptions: tsConfig.compilerOptions,
      copyDtsFiles: true
    }),
    resolveNode()
  ]
})
