import path from 'path';
import webpack = require('webpack');

const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/server.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.d.ts', '.tsx'],
  },
  target: 'node',
  plugins: [new webpack.ContextReplacementPlugin(/.*/)],
};

export default config;
