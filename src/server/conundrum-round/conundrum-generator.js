var baseWordList = Array.from(require('../vendor/conundrum-sources/conundrum-word-list'));
var solver = require('../vendor/validation/solver');

function generateConundrum() {
    var first = getRandomNumber(0, baseWordList.length);
    var available = getAvailableIndexes(first);
    var maxTries = 100;
    var tries = 0;
    var second;
    var witness = {};
    do {
        if(available.length !== 0 && tries < maxTries) {
            second = getRandomNumber(0, available.length)
            second = available.splice(second, 1)[0];
            tries++;
            witness = isAnagram(baseWordList[first], baseWordList[second]);
        } else {
            var next = getRandomNumber(0, baseWordList.length);
            while(first === next) {
                next = getRandomNumber(0, baseWordList.length);
            }
            first = next;
            available = getAvailableIndexes(first);
            second = undefined;
            tries = 0;
        }
    } while(second === undefined || !witness.isAnagram);

    return {
        first: baseWordList[first].toLowerCase(),
        second: baseWordList[second].toLowerCase(),
        solution: witness.solution
    };
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function isAnagram (firstWord, secondWord) {
    var letters = firstWord.split('').concat(secondWord.split('')).join('').toLowerCase();
    var list = solver.solve_letters(letters)
    list.sort(function(a, b) {
        return b.length - a.length;
    });
    if(list[0] !== undefined && list[0].length === 10) {
        return {
            isAnagram: true,
            solution: list[0]
        }
    }
    return {
        isAnagram: false
    };
}

function getAvailableIndexes(first) {
    var available = [];
    for(i = 0; i< baseWordList.length; i++) {
        if(i !== first) {
            available.push(i);
        }
    }
    return available
}

module.exports = generateConundrum;
