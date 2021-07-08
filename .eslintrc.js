module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
  },
  // 全局变量
  globals: {
    VHALL_ZK: true,
    VhallPlayer: true,
    VHDocSDK: true,
    VhallChat: true,
    VhallReport: true,
    Vhall_User_Actions: true,
    _log: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'vue/no-parsing-error': [1, {
      "x-invalid-end-tag": false,
      "invalid-first-character-of-tag-name": false
    }],
    semi: [1],
    eqeqeq: [0],
    camelcase: 0,
    'space-before-function-paren': [0],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
