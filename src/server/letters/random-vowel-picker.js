var letterLists = require('./letter-lists');
const vowels = letterLists.vowels;
const totalWeights = letterLists.totalWeights;

function randomVowel() {
    var totalWeight = totalWeights.vowels;
    var randomNum = randomInteger(0, totalWeight);
    var weightSum = 0;

    for(var i in vowels) {
        weightSum += vowels[i];
        if(randomNum <= weightSum) {
            return i;
        }
    }
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

module.exports = randomVowel;