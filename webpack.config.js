//@ts-check

'use strict';

const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

const webpack = require('webpack');
const target = "node";
const mode = process.env.NODE_ENV === "development" ? "development": "production";
const isDev = mode === "development"

/**@type {import('webpack').Configuration}*/
const config = {
  target, // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
	mode, // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  devtool: 'nosources-source-map',
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vsceignore file
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js'],

  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  plugins: [

    ...(target === "node" ? [
      new webpack.ProvidePlugin({
        "fetch": ["node-fetch","default"],
        "WebSocket": ["websocket-polyfill"],
        "Blob": ["blob-polyfill", "Blob"],
      })
    ]: [])

    // new CopyPlugin({
    //   patterns: [
    //     {from: './dist/*', to: './../../../dist/vscode-web/dist/extensions/gito-extension', force: true},
    //     {from: './package.json', to: './../../../dist/vscode-web/dist/extensions/gito-extension', force: true}
    //   ],
    // }, {
    //   copyUnmodified: true
    // })
  ]
};
module.exports = config;