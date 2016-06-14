var cloak = require('cloak');

var config = require('./config');

cloak.configure({
    port: config.cloakPort
});

cloak.run();