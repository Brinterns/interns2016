var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var cloneWith = require('../utils/clone-with');
var configShared = require('./config.shared');

var configTest = cloneWith(configShared, {
    devtool: 'inline-source-map',
    plugins: [
        new ExtractTextPlugin('', { disable: true })
    ],
    externals: {
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
    }
}, true);

// Add rewire to js loader
configTest.module.loaders[0].query.plugins = ['rewire'];

module.exports = configTest;
