var path = require('path');

var root = path.resolve(__dirname, '../../');
var src = path.join(root, 'src');
var dist = path.join(root, 'dist');

var clientSrc = path.join(src, 'client');
var clientSrcConfig = path.join(clientSrc, 'config');
var clientDist = path.join(dist, 'client');

var serverSrc = path.join(src, 'server');
var serverSrcGlob = path.join(serverSrc, '**/*');
var serverDist = path.join(dist, 'server');
var serverConfig = require('../../src/server/config');
var serverAddress = require('../utils/server-address');

module.exports = {
    dist: dist,
    client: {
        src: clientSrc,
        config: {
            name: 'config.js',
            local: path.join(clientSrcConfig, 'config.local.js'),
            dev: path.join(clientSrcConfig, 'config.dev.js'),
            prod: path.join(clientSrcConfig, 'config.prod.js'),
            dest: clientSrcConfig
        },
        index: path.join(clientSrc, 'index.html'),
        dist: {
            location: clientDist,
            js: path.join(clientDist, 'js'),
            css: path.join(clientDist, 'css')
        }
    },
    server: {
        src: serverSrc,
        srcGlob: serverSrcGlob,
        address: serverAddress(serverConfig),
        filesForBuild: [serverSrcGlob, '!' + serverSrcGlob + '.spec.js'],
        dist: {
            location: serverDist,
            watch: path.join(serverDist, '**/*')
        }
    },
    karmaConfig: path.join(__dirname, './karma.config.js'),
    publicPath: '/'
};
