module.exports = {
  // true にすると、これより親階層の設定ファイルを探しにいかない
  root: true,
  // 静的検証をするファイルが動作する環境を指定する
  env: {
    // console.log などを利用してもエラーが発生しなくなる
    browser: true,
    // ES2020 までの構文を利用してもエラーが発生しなくなる
    // parserOptions.ecmaVersion に自動で 11 がセットされる
    es2020: true,
  },
  parserOptions: {
    // ES Modules を利用してもエラーが発生しなくなる
    sourceType: 'module',
  },
  // 外部で提供されている設定を利用する
  extends: [
    // ESLint のおすすめの設定。有効になる設定は https://eslint.org/docs/rules/ を参照
    'eslint:recommended',
    // Prettier を利用したフォーマットが有効になる
    // 有効にするには、[eslint-config-prettier, eslint-plugin-prettier] が必要
    // extendsの最後に記述
    'plugin:prettier/recommended',
  ],
  rules: {
    // 更新をしない変数の宣言に、const 以外を利用した場合はエラーになる
    'prefer-const': 'error',
  },
};
