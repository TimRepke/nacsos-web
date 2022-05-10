module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': ['error', { // maximum length of lines
      code: 140,
      ignorePattern: '(d|style)="[^"]*"', // do this to ignore long lines for svg paths and long styles
      ignoreStrings: true,
      ignoreTrailingComments: true, // allow comments to be longer than max. line length
    }],
    'vuejs-accessibility/label-has-for': ['error', {
      required: {
        some: ['nesting', 'id'],
      },
      allowChildren: false,
    }],
    'object-curly-newline': ['error', {
      ObjectPattern: 'never',
    }],
    'class-methods-use-this': 'off',
    'prefer-promise-reject-errors': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
  },
};
