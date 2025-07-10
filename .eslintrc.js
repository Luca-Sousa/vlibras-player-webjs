module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
    'no-debugger': 'error'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.js'
  ]
};
