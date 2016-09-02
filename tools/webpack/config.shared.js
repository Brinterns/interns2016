var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var locationConfig = require('../config/location.config');

module.exports = {
    entry: path.join(locationConfig.client.src, 'index.js'),
    output: {
        path: locationConfig.client.dist.location,
        filename: 'js/bundle.js',
        publicPath: locationConfig.publicPath
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react', 'stage-0']
                },
                include: locationConfig.client.src
            },
            {
                test: /(\.scss|\.css)$/,
                loader: ExtractTextPlugin.extract('style', [
                    'css?modules&camelCase&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    'postcss',
                    'sass'
                ])
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ]
    },
    postcss: [
        require('autoprefixer')
    ]
};
