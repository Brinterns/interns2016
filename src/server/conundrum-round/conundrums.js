var fs = require('fs');
var generateConundrum = require('./conundrum-generator');

var l = []
for(var i = 0 ; i < 5000; i++) {
    console.log(i);
    l.push(generateConundrum());
}

 fs.writeFile('./conundrum-list.js', 'module.exports = ' + JSON.stringify(l));
