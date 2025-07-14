
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist/umd'),
    filename: 'vlibras-player.min.js',
    library: {
      name: 'VLibras',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this',
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    // Não incluir dependências externas no bundle UMD
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'assets'), to: path.resolve(__dirname, 'dist/assets') }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'demo'),
    },
    compress: true,
    port: 8080,
    open: true
  }
};
