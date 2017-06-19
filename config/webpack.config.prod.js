
const path = require('path');
const webpack = require('webpack');
const DotenvPlugin = require('webpack-dotenv-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// App files location
const PATHS = {
  root: path.resolve(__dirname, '../src'),
  app: path.resolve(__dirname, '../src/js'),
  styles: path.resolve(__dirname, '../src/styles'),
  build: path.resolve(__dirname, '../build'),
  images: path.resolve(__dirname, '../src/images'),
};

const GLOBALS = {
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
};

const plugins = [
  new DotenvPlugin({
    sample: path.resolve(PATHS.root, '../.env.default'),
    path: path.resolve(PATHS.root, '../.env.prod'),
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'js/vendor.bundle.js',
    minChunks: Infinity,
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin(GLOBALS),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false, screw_ie8: true },
    output: { comments: false },
    sourceMap: false,
  }),
  new CopyWebpackPlugin([
    { from: PATHS.images, to: 'images' },
  ]),
  new ExtractTextPlugin({
    filename: 'css/app.css',
    allChunks: true,
  }),
];

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    app: ['babel-polyfill', path.resolve(PATHS.app, 'main')],
    vendor: ['react'],
  },
  output: {
    path: PATHS.build,
    filename: 'js/[name].js',
    publicPath: '/',
  },
  resolve: {
    modules: [PATHS.app, 'node_modules'],
    descriptionFiles: ['package.json'],
    enforceExtension: false,
    extensions: ['*', '.js', '.jsx', '.scss'],
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        include: PATHS.styles,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?sourceMap',
            'postcss-loader',
            'sass-loader?outputStyle=compressed',
          ],
        }),
      },
      {
        test: /\.css$/,
        include: PATHS.styles,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader!postcss-loader'],
        }),
      },
      {
        test: /\.json$/i,
        use: ['json-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        use: ['url-loader?limit=8192'],
      },
    ],
  },
  plugins: plugins,
};
