module.exports = {
  extends: ['react-app', 'plugin:valtio/recommended'],
  rules: {
    'react/jsx-key': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'styled-components',
            message: 'Please import from styled-components/macro.',
          },
        ],
        patterns: ['!styled-components/macro'],
      },
    ],
  },
}
