const reassurances = [
    'Stop stressing',
    'It\'s bless',
    'It\'s just the tip',
    'The problem with Arsenal is they always try and walk it in',
    'Don\'t h8, appreshe-8',
    'h8ers r my motivaters',
    'countdown is just more capitalist propaganda, WAKE UP SHEEPLE'
]

const greatLeaders = [
    'Martin Luther King',
    'Nelson Mandela',
    'Mahatma Gandhi',
    'Margaret Thatcher',
    'Rosa Parks',
    'Adolf Hitler',
    'Madonna'
]

function getRandomInteger(max) {
    return Math.floor(Math.random() * (max));
}

let prevReassuraceIndex = 0;
let prevLeaderIndex = 0;
export default function getReassurance() {
    let reassuranceIndex = getRandomInteger(reassurances.length);
    while(reassuranceIndex === prevReassuraceIndex){
        reassuranceIndex = getRandomInteger(reassurances.length);
    }
    
    let leaderIndex = getRandomInteger(greatLeaders.length);
    while(leaderIndex === prevLeaderIndex){
        leaderIndex = getRandomInteger(greatLeaders.length);
    }

    prevReassuraceIndex = reassuranceIndex;
    prevLeaderIndex = leaderIndex;
    return ('\"' + reassurances[reassuranceIndex] + '\" - ' + greatLeaders[leaderIndex]);
}