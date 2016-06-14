module.exports = function(serverConfig) {
    var serverAddress = serverConfig.protocol + '://' + serverConfig.host;

    if(serverConfig.port !== 80) {
        serverAddress += ':' + serverConfig.port;
    }

    return serverAddress;
};
