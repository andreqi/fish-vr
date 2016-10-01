var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/other.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  }
};
