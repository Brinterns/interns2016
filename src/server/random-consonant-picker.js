var letterLists = require('./letter-lists');
const consonants = letterLists.consonants;
const totalWeights = letterLists.totalWeights;

function randomConsonant() {
    var totalWeight = totalWeights.consonants;
    var randomNum = randomInteger(0, totalWeight);
    var weightSum = 0;

    for(var i in consonants) {
        weightSum += consonants[i];
        if(randomNum <= weightSum) {
            return i;
        }
    }
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

module.exports = randomConsonant;