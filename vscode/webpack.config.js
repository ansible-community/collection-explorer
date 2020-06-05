const path = require('path');

module.exports = {
  entry: {
    pluginRender: './src/view/plugin-render.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'plugin-render-dist'),
    filename: '[name].js'
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'awesome-typescript-loader',
        options: {}
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  },
  performance: {
    hints: false
  }
};
