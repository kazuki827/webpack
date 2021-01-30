module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 必要なポリフィルのみを取り込みたい場合、usage を指定する
        useBuiltIns: 'usage',
        // core-js（ポリフィル）のバージョンを指定する（指定しないとバージョン２が利用され警告が出力される）
        corejs: 3,
        // true にすると利用しているポリフィルなどの情報が出力される
        // ポリフィルが含まれているかどうかを確認するためのものなので必須ではない
        // debug: true,
      },
    ],
  ],
};
