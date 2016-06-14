var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var cloneWith = require('../utils/clone-with');
var configShared = require('./config.shared');
var devServerConfig = require('./dev-server.config');

var configDev = cloneWith(configShared, {
    devtool: 'eval-source-map',
    entry: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?' + devServerConfig.address,
        'webpack/hot/only-dev-server',
        configShared.entry
    ],
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('', { disable: true })
    ]
}, true);

// Add react hot loader to js/jsx loader
configDev.module.loaders[0].query.plugins = ['react-hot-loader/babel'];

module.exports = configDev;
