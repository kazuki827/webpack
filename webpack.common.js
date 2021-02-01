// Node.js の組み込みモジュール。出力先などを絶対パスで指定するために利用する。
const path = require('path');
// output.path に指定したディレクトリ内のファイルを削除するプラグイン
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// バンドルを読み込んだ HTML を出力するプラグイン
const HtmlWebpackPlugin = require('html-webpack-plugin');
// バンドルされる CSS を別の CSS ファイルに抽出する
// => 1 出力されるJSのファイルサイズが大きくなるため、ファイルの読み込み時間が長くなりJSが実行されるまで時間がかかる。
// => 2 cssがjsに含まれため、cssがキャッシュできない。
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // エントリーポイント
  entry: {
    app: './src/js/app.js',
    another: './src/js/another.js',
  },

  // 出力の設定
  output: {
    // 出力先のパス（絶対パスを指定しないとエラーが出るので注意）
    path: path.resolve(__dirname, 'public'),
    // 出力するファイル名
    // [name] には entry に指定した名前が入る
    // 今回、entry に app と another を指定しているため、app.[contenthash].js と another.[contenthash].js が出力される
    // [contenthash] には出力するファイル毎に固有のハッシュが入る => ブラウザキャッシュ対策
    filename: 'js/[name].[contenthash].js',
    // splitChunksPlugin など、エントリーポイント以外から出力されるファイル名
    // optimization.splitChunks.cacheGroups.vendor.name に vendor を指定しているので vendor.[contenthash].js が出力される
    // また、optimization.splitChunks.cacheGroups.vendorsModules.name に vendor-modules を指定しているので vendor-modules.[contenthash].js が出力される
    // [contenthash] には出力するファイル毎に固有のハッシュが入る
    chunkFilename: 'js/[name].[contenthash].js',
  },

  // 最適化
  optimization: {
    // splitChunksPlugin の設定（分割したファイルを出力するための設定）
    splitChunks: {
      // 分割の対象。以下の値を指定できる。
      // initial: 静的にインポートしているモジュール、async: 動的（ダイナミック）にインポートしているモジュール、all: すべて
      chunks: 'initial',
      cacheGroups: {
        vendor: {
          // node_modules 配下のモジュールをバンドル対象とする
          test: /node_modules/,
          // 出力するファイル名
          name: 'vendor',
        },
        vendorsModules: {
          // src/js/modules 配下のモジュールをバンドル対象とする
          // 普通の[/]はwindowsで動作しない
          test: /src[\\/]js[\\/]modules/,
          // 出力するファイル名
          name: 'vendor-modules',
          // 分割の対象とするモジュールの最小サイズ
          minSize: 0,
          // モジュールがいくつの箇所で利用されていれば分割の対象にするか
          minChunks: 2,
        },
      },
    },
  },

  // ローダーの設定
  module: {
    rules: [
      {
        // pre が指定されていないローダーよりも早く処理が実行される
        enforce: 'pre',
        // ローダーの処理対象ファイル
        test: /\.js$/,
        // ローダーの処理対象から外すディレクトリ
        exclude: /node_modules/,
        // 利用するローダー
        loader: 'eslint-loader',
        options: {
          // 一部のエラーを自動修正する
          fix: true,
        },
      },
      {
        // ローダーの処理対象ファイル
        test: /\.js$/,
        // ローダーの処理対象から外すディレクトリ
        exclude: /node_modules/,
        // 利用するローダー
        loader: 'babel-loader',
      },
      {
        // ローダーの処理対象ファイル
        test: /\.scss$/,
        // 利用するローダー。以下の順番で実行される。(指定した順番の逆から実行される。)
        // 1. sass-loader (productionモードの時は自動で圧縮)
        // 2. postcss-loader (ベンダープレフィックス .browserslistrc)
        // 3. css-loader
        // 4. MiniCssExtractPlugin.loader
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        // ローダーの処理対象ファイル
        test: /\.(jpe?g|gif|png|svg)$/,
        // 利用するローダー。以下の順番で実行される。
        // 1. image-webpack-loader
        // 2. file-loader
        use: [
          {
            loader: 'file-loader',
            options: {
              // [name] にはバンドル前のファイル名が入り、[ext] にはバンドル前のファイルの拡張子が入る。
              name: '[name].[contenthash].[ext]',
              // 画像の出力先
              // デフォルトでは output.path に指定したパス（今回は public）に出力される
              // 今回は public/images に出力させたいため、以下のように指定する
              outputPath: 'images',
              // 出力されるファイル（CSS など）に指定される画像のパス
              // 今回の場合、出力された CSS に記述されるパスは /images/background.jpg のようになる
              publicPath: '/images',
            },
          },
          'image-webpack-loader',
        ],
      },
      {
        // ローダーの処理対象ファイル
        test: /\.html$/,
        // 利用するローダー
        loader: 'html-loader',
      },
    ],
  },

  // プラグインの設定
  plugins: [
    // output.path に指定したディレクトリ（今回は public）内のファイルを削除してからビルドが実行される
    new CleanWebpackPlugin(),
    // バンドルを読み込んだ HTML を出力する
    new HtmlWebpackPlugin({
      // テンプレート
      template: './src/html/index.html',
      // どのエントリーポイントから出力されるファイルを読み込んだ HTML を出力するのかを指定する
      // 今回の場合、app から出力される app.[contenthash].js を読み込んだ HTML を出力する
      chunks: ['app'],
    }),
    // バンドルを読み込んだ HTML を出力する
    new HtmlWebpackPlugin({
      // 出力するファイル名
      filename: 'another.html',
      // テンプレート
      template: './src/html/another.html',
      // どのエントリーポイントから出力されるファイルを読み込んだ HTML を出力するのかを指定する
      // 今回の場合、another から出力される another.[contenthash].js を読み込んだ HTML を出力する
      chunks: ['another'],
    }),
    // バンドルされる CSS を別の CSS ファイルに抽出する
    new MiniCssExtractPlugin({
      // このファイルが出力される起点となるディレクトリは output.path
      // そのため、今回出力されるファイルは public/css/[name].[contenthash].css
      // [name]にはエントリーポイント名が入る。今回利用している style.scss は app.js で
      // 利用しており、app.js のエントリーポイント名は app なので、[name] には app が入る。
      filename: './css/[name].[contenthash].css',
    }),
  ],
};
