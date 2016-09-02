var fs = require('fs');
fs.readFile('./five-letter-words.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var e = data.trim().split(/\s/);
  fs.writeFile('./conundrum-word-list.js', 'module.exports = ' + JSON.stringify(e));
});
