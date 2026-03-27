import idiomaticOrder from 'stylelint-config-idiomatic-order'

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-prettier-scss', 'stylelint-config-idiomatic-order'],
  plugins: ['stylelint-order', 'stylelint-scss'],
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.css'],
      customSyntax: 'postcss',
    },
  ],
  rules: {
    'order/order': ['custom-properties', 'declarations'],
    'no-empty-source': null,
    'order/properties-order': idiomaticOrder.rules['order/properties-order'],
    'at-rule-no-unknown': null,
    'at-rule-descriptor-value-no-unknown': null,
    'media-query-no-invalid': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['use', 'forward'],
      },
    ],
  },
}
