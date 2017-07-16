const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const env = process.env.NODE_ENV;

/*
  webpack sees every file as a module.
  How to handle those files is up to loaders.
  We only have a single entry point (a .js file) and everything is required from that js file
*/

// This is our JavaScript rule that specifies what to do with .js files
const javascript = {
  test: /\.(js)$/, // see how we match anything that ends in `.js`? Cool
  use: [{
    loader: 'babel-loader',
    options: { presets: ['env', 'react'] } // this is one way of passing options
  }],
};

const config = {
  entry: {
    Editor: './public/javascript/editor.js',
    Questao: './public/javascript/questao/App.js',
    main: './public/javascript/main.js'
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      javascript, 
      {
        test: /\.css$/,
        use: env === 'production'
        ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        }): [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('main.css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ]
};

// webpack is cranky about some packages using a soon to be deprecated API.
process.noDeprecation = true;

module.exports = config;
