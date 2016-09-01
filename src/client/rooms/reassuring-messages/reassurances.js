const reassurances = [
    'The problem with Arsenal is they always try and walk it in',
    'Countdown is just more capitalist propaganda, WAKE UP SHEEPLE',
    'The game can be started when more than two people are in the room',
    'Only the room leader can start a game, look at the top of the page for their name!',
    'Don\'t worry, it\'s just Countdown',
    'You can only use brackets and arithmetic operators in the numbers round!',
    'Be careful not to use letters that aren\'t shown in the letters round!',
    'If you find Flaps, please notify Tom Hull',
    'RIP Richard Whitely',
    'Bring back Carol',
    'In the condundrum round, look for common prefixes and suffixes!'
]

const greatPeople = require('./parsed-people.js');

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

let prevReassuraceIndex = 0;
let prevPersonIndex = 0;
let prevRandomDate = 1900;
export default function getReassurance() {
    let reassuranceIndex = getRandomInteger(0, reassurances.length);
    while(reassuranceIndex === prevReassuraceIndex){
        reassuranceIndex = getRandomInteger(0, reassurances.length);
    }
    
    let personIndex = getRandomInteger(0, greatPeople.length);
    while(personIndex === prevPersonIndex){
        personIndex = getRandomInteger(0, greatPeople.length);
    }

    let randomDate = getRandomInteger(1900, 2016);
    while(randomDate === prevRandomDate){
        randomDate = getRandomInteger(1900, 2016);
    }

    prevRandomDate = randomDate;
    prevReassuraceIndex = reassuranceIndex;
    prevPersonIndex = personIndex;
    return ({ message: reassurances[reassuranceIndex], person: greatPeople[personIndex] + ', ' + randomDate});
}