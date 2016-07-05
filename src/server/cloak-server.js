var cloak = require('cloak');

module.exports = function(expressServer) {
    cloak.configure({
        express: expressServer
    });

    cloak.run();
};
