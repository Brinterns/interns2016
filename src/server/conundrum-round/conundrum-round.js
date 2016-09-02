var parameters = require('../parameters');
var solver = require('../vendor/validation/solver');

var answerTimer;
var timeLeft;

function startAnswering(room) {
    var users = room.getMembers();
    room.data.answerTime = parameters.conundrumTime;
    room.data.answering = true;
    room.messageMembers('startAnswering', parameters.conundrumTime);
    timeLeft = setInterval(answerTimeTick.bind(null, room), 1000);
    answeringTimer = setTimeout(answeringFinished.bind(null, room, timeLeft), parameters.conundrumTime*1000);
}

function answeringFinished(room, timeLeft) {
    room.messageMembers('stopAnswering');
    room.data.answering = false;
    clearInterval(timeLeft);
}

function answerTimeTick(room) {
    room.data.answerTime--;
}

function submitAnagram(anagram, user) {
    var room = user.getRoom();
    if(room.data.possibleAnswers[user.id] === undefined) {
        room.data.possibleAnswers[user.id] = anagram;
        if(verifyAnswer(room, anagram)) {
            //correct
            console.log('gud'+ user.id);
        } else {
            console.log('bad'+ user.id);
            //incorrect
        }
    }
}

function verifyAnswer(room, answer) {
    if(answer.length !== parameters.conundrumLength) {
        return false;
    }
    var anagram = room.data.conundrumRound.anagram;
    var solutions = solver.solve_letters(anagram.toLowerCase());
    answer = answer.toLowerCase();
    if(solutions.indexOf(answer) !== -1) {
        return true;
    }

    return false;
}

module.exports = {
    startAnswering,
    submitAnagram
};
