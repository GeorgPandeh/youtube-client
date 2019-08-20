const path = require('path');

module.exports = {
  entry: './src/YouTube.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
