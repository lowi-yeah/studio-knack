const webpack           = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractSass       = new ExtractTextPlugin('all.css')

module.exports = {
  entry: {
    index:    __dirname + '/assets/js/index.js',
    dawn:     __dirname + '/assets/js/dawn.js',
    article:  __dirname + '/assets/js/article.js'
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
        query: { presets: ['es2015'] }},

      // images
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: "file-loader?name=/images/[name].[ext]"},
      
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=/assets/fonts/[name].[ext]' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=/assets/fonts/[name].[ext]' },
      { test: /\.[ot]tf(\?v=\d+\.\d+\.\d+)?$/,  loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=/assets/fonts/[name].[ext]' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,     loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=/assets/fonts/[name].[ext]'}
    ]
  },
  plugins: [
    extractSass,
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      comments: false,
    })  
    ],
   worker: {
    output: {
      filename: "/hash.worker.js",
      chunkFilename: "[id].hash.worker.js"
    }
  }
};

