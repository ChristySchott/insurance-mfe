import nodeConfig from '@insurance-mfe/eslint-config/node'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['dist', 'node_modules'],
  },
  ...nodeConfig,
])
