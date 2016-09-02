var fs = require('fs');
var generateConundrum = require('./conundrum-generator');

//generate 5000 conundrums
var list = [];
for(var i = 0 ; i < 5000; i++) {
    console.log(i);
    list.push(generateConundrum());
}

//filter all duplicates
var l = [];
for(var i = 0; i < list.length; i++) {
    var ok = true;
    for(var j = 0; j < l.length; j++) {
        if((list[i].first === l[j].first && list[i].second === l[j].second) || (list[i].first === l[j].second && list[i].second === l[j].first)) {
            ok = false;
        }
    }
    if(ok) {
        l.push(list[i]);
    }
}
fs.writeFile('./conundrum-list.js', 'module.exports = ' + JSON.stringify(l));
