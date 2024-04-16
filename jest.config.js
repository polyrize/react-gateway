import {pathsToModuleNameMapper} from 'ts-jest'

import config from './tsconfig.json' assert {type: 'json'}

const {compilerOptions} = config

const jestConfig = {
	preset: 'ts-jest',
  testEnvironment: 'jsdom',
	verbose: true,
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  injectGlobals: false,
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl].filter(Boolean),
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths || {}),
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: [
    '<rootDir>/test/**/*.spec.[jt]s?(x)'
  ],
  extensionsToTreatAsEsm: ['.ts', '.jsx', '.tsx']
}

export default jestConfig
