// 設定をマージする関数
const { merge } = require('webpack-merge');
// 共通設定を読み込む
const commonConfig = require('./webpack.common.js');
// JavaScritpt を圧縮するプラグイン
const TerserPlugin = require('terser-webpack-plugin');
// CSS を最適化するプラグイン
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// 開発用の設定と共通設定（commonConfig）をマージする
module.exports = merge(commonConfig, {
  // モードの設定（モードを指定しないとwebpack実行時に警告が出る）
  mode: 'production',
  optimization: {
    minimizer: [
      // JavaScritpt を圧縮する
      new TerserPlugin({
        // ライブラリのライセンスコメントなどを抽出した「xxx.LICENSE.txt」のようなファイルが出力されないようにする
        extractComments: false,
        // terser のオプション
        // 詳細は https://github.com/terser/terser#minify-options を参照
        terserOptions: {
          // console を削除する
          compress: {
            drop_console: true,
          },
        },
      }),
      // 出力される CSS を最適化する
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
});
