module.exports = {
  extends: ['stylelint-config-standard'],
  customSyntax: 'postcss-styled-syntax',
  rules: {
    'selector-type-case': ['lower', { ignoreTypes: ['/^\\$\\w+/'] }],
    'declaration-colon-newline-after': null,
    'declaration-empty-line-before': null,
    'no-descending-specificity': null,
    'keyframes-name-pattern': null,
    'declaration-block-semicolon-newline-after': null,
    'no-empty-source': null,
  },
}
