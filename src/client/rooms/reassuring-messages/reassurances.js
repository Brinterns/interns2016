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
    'In the condundrum round, look for common prefixes and suffixes!',
    'People don\'t think the universe be like it is, but it do.',
    'One morning I shot an elephant in my pajamas. How he got in my pajamas, I don\'t know.',
    'Now, you listen here! He\'s not the Messiah. He\'s a very naughty boy!',
    'Wubba lubba dub dub!',
    'Would you like a cup of tea Father?',
    'KENNY MODE ACTIVATED'
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
    if(reassurances[reassuranceIndex] === 'KENNY MODE ACTIVATED') {
        return ({ message: reassurances[reassuranceIndex], person: 'KENNETH GRAY, 2019'});
    }
    return ({ message: reassurances[reassuranceIndex], person: greatPeople[personIndex] + ', ' + randomDate});
}