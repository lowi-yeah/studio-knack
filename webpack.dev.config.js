const webpack           = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractSass       = new ExtractTextPlugin('all.css')

module.exports = {
  entry: {
    dawn:   __dirname + '/assets/js/dawn.js',
    index:  __dirname + '/assets/js/index.js',
    detail: __dirname + '/assets/js/detail.js'
  },
  resolve: {
    root: __dirname + '/assets/js',
    alias: {} },
  output: {
    path: __dirname + '/public/assets',
    filename: '[name].js',
    publicPath: '/assets',
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },

      { test: /.*\.sass$/,
        loader: extractSass.extract(['css', 'postcss-loader', 'sass', 'import-glob'])},
      
      { test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: { presets: ['es2015'] } },

      { test: /\.(jpe?g|png|gif|svg)$/i, loader: "file-loader?name=/images/[name].[ext]"},

      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=/fonts/[name].[ext]' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=/fonts/[name].[ext]' },
      { test: /\.[ot]tf(\?v=\d+\.\d+\.\d+)?$/,  loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=/fonts/[name].[ext]' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,     loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=/fonts/[name].[ext]'}
    ]
  },
  plugins: [
    extractSass,
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }
    }),
  ],
  devServer: {
    port:     3000,
    inline:   true,
    stats:    'minimal'
  },
  worker: {
    output: {
      filename: "/hash.worker.js",
      chunkFilename: "[id].hash.worker.js"
    }
  }
};

