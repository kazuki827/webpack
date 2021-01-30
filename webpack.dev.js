// Node.js の組み込みモジュール。出力先などを絶対パスで指定するために利用する。
const path = require('path');
// 設定をマージする関数
const { merge } = require('webpack-merge');
// 共通設定を読み込む
const commonConfig = require('./webpack.common.js');

// 開発用の設定と共通設定（commonConfig）をマージする
module.exports = merge(commonConfig, {
  // モードの設定（モードを指定しないとwebpack実行時に警告が出る）
  mode: 'development',
  // watch モードを有効にする
  watch: true,
  // ソースマップ
  devtool: 'cheap-module-eval-source-map',
  // webpack-dev-server の設定
  devServer: {
    // サーバー起動時にブラウザを自動的に起動する
    open: true,
    // ポート番号
    port: 9000,
    // コンテンツのルートディレクトリ
    // サーバーを起動すると、public/index.html が開かれる
    contentBase: path.resolve(__dirname, 'public'),
  },
});
