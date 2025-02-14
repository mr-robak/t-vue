import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
        ecmaVersion: 2022,
      },
    },
    rules: {
      'vue/valid-template-root': 'error',
      'vue/require-default-prop': 'error',
      'vue/multi-word-component-names': 'error',
      'vue/no-unused-vars': 'error',
    },
  },
]
