var path = require('path');

var locationConfig = require('./location.config');
var webpack = require('../webpack/config.test');

module.exports = function(config) {
    config.set({
        basePath: locationConfig.client.src,
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        reporters: ['mocha'],
        files: [
            '**/*.spec.js*'
        ],
        preprocessors: {
            '**/*.js*': ['webpack']
        },
        webpack: webpack,
        webpackMiddleware: {
            stats: 'errors-only'
        }
    });
};
