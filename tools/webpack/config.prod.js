var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var cloneWith = require('../utils/clone-with');
var configShared = require('./config.shared');

module.exports = cloneWith(configShared, {
    bail: true,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin('css/bundle.css')
    ]
});
