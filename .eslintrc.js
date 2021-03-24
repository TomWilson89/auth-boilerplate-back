module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['airbnb/base', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/rule-name': 'error',
    'no-console': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/first': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    // 'linebreak-style': 0,
    // 'global-require': 0,
    // 'eslint linebreak-style': [0, 'error', 'windows'],
    // 'no-shadow': 'off',
    // 'implicit-arrow-linebreak': 'off',
    // 'no-return-await': 'off',
    // 'operator-linebreak': 'off',
  },
};
