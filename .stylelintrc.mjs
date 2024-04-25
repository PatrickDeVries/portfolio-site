export default {
  extends: ['stylelint-config-standard'],
  customSyntax: 'postcss-styled-syntax',
  rules: {
    'selector-type-case': ['lower', { ignoreTypes: ['/^\\$\\w+/'] }],
    'declaration-empty-line-before': null,
    'no-descending-specificity': null,
    'keyframes-name-pattern': null,
    'no-empty-source': null,
  },
}
