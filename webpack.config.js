const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const env = process.env.NODE_ENV;

const javascript = {
  test: /\.(js)$/,
  use: [
    {
      loader: 'babel-loader',
      options: { presets: ['env', 'react', 'stage-0'] }
    }
  ]
};

const config = {
  entry: {
    Editor: './public/javascript/editor.js',
    Questao: './public/javascript/questao/App.js',
    main: './public/javascript/main.js',
    index: './public/javascript/index.js',
    Lista: './public/javascript/ListaExercicio/index.js',
    Prova: './public/javascript/Prova.js',
    'diagnostico/questoes': './public/javascript/diagnostico/questoes.js'
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
        use:
          env === 'production'
            ? ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader']
              })
            : ['style-loader', 'css-loader']
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
