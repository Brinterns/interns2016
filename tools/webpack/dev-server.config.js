var serverAddress = require('../utils/server-address');
var locationConfig = require('../config/location.config');

var devServerConfig = {
    protocol: 'http',
    host: 'localhost',
    port: 5000
};

module.exports = Object.assign({}, devServerConfig, {
    address: serverAddress(devServerConfig),
    options: {
        hot: true,
        publicPath: locationConfig.publicPath,
        proxy: {
            '*': locationConfig.server.address
        },
        stats: 'errors-only'
    }
});