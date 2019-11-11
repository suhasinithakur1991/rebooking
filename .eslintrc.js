module.exports = {
  'env': {
    'browser': false,
    'es6': true,
  },
  // 'extends': 'google',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'rules': {
    'no-console': ['warn'],
    'no-empty': 'error',
    'brace-style': ["error", "stroustrup"],
    'object-curly-spacing': ["error", "always"],
    'no-duplicate-imports': "error",
    'no-dupe-args': "error"
  },
  'parser': '@typescript-eslint/parser',
  'plugins': ['@typescript-eslint']
};
