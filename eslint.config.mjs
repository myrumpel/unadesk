import js from '@eslint/js'
import angular from 'angular-eslint'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import importX from 'eslint-plugin-import-x'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '**/models-generated/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      eslintPluginPrettierRecommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir,
      },
    },
    settings: {
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts'],
      },
      'import-x/resolver': {
        typescript: {
          project: ['./tsconfig.app.json', './tsconfig.spec.json'],
          alwaysTryTypes: true,
        },
        node: true,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/contextual-decorator': 'error',
      '@angular-eslint/no-async-lifecycle-method': 'error',
      '@angular-eslint/no-attribute-decorator': 'error',
      '@angular-eslint/no-lifecycle-call': 'error',
      '@angular-eslint/prefer-output-readonly': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/sort-lifecycle-methods': 'warn',
      '@angular-eslint/use-injectable-provided-in': 'error',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'uk',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'uk',
          style: 'kebab-case',
        },
      ],

      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: {
            memberTypes: [
              'signature',
              'constructor',
              'public-static-method',
              'protected-static-method',
              'private-static-method',
              'public-instance-method',
              'protected-instance-method',
              'private-instance-method',
            ],
            order: 'as-written',
          },
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-magic-numbers': [
        'warn',
        {
          ignore: [0, 1, -1],
          ignoreDefaultValues: true,
          ignoreArrayIndexes: true,
          enforceConst: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
        },
      ],

      '@typescript-eslint/no-empty-function': 'off',

      '@typescript-eslint/no-unused-vars': ['error'],

      'no-duplicate-imports': 'error',
      'import-x/named': 'error',
      'import-x/default': 'error',
      'import-x/export': 'error',
      'no-console': ['warn', { allow: ['error'] }],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.object.name='JSON'][callee.property.name='parse'][arguments.0.callee.object.name='JSON'][arguments.0.callee.property.name='stringify']",
          message: 'Не используйте JSON.parse(JSON.stringify()) — заменить на cloneDeep',
        },
      ],

      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/app/core/**/*',
              from: ['./src/app/pages/**/*', './src/app/widgets/**/*', './src/app/layouts/**/*'],
              message: 'Запрещены импорты pages, layouts и widgets',
            },
            {
              target: './src/app/layouts/**/*',
              from: ['./src/app/pages/**/*'],
              message: 'Запрещены импорты pages',
            },
            {
              target: './src/app/pages/**/*',
              from: ['./src/app/layouts/**/*'],
              message: 'Запрещены импорты layouts',
            },
            {
              target: './src/app/shared/**/*',
              from: [
                './src/app/core/api/api/**/*',
                './src/app/core/services/**/*',
                './src/app/core/guards/**/*',
                './src/app/core/interceptors/**/*',
                './src/app/pages/**/*',
                './src/app/widgets/**/*',
                './src/app/layouts/**/*',
              ],
              message: 'Общие компоненты не должны зависеть от core сервисов, pages, layouts или widgets',
            },
            {
              target: './src/app/widgets/**/*',
              from: ['./src/app/pages/**/*', './src/app/layouts/**/*'],
              message: 'В widgets не допускается импорт чего-либо из pages и layouts',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-self-closing-tags': ['error'],
      '@angular-eslint/template/elements-content': ['error'],
    },
  },
  eslintConfigPrettier,
)
