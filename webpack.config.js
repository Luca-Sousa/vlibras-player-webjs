const path = require('path');

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
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    // Não incluir dependências externas no bundle UMD
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'demo'),
    },
    compress: true,
    port: 8080,
    open: true
  }
};
