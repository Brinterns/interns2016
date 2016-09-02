var parameters = require('../parameters');
var solver = require('../vendor/validation/solver');

var answeringTimer;
var timeLeft;

function startAnswering(room) {
    var users = room.getMembers();
    room.data.answerTime = parameters.conundrumTime;
    room.data.answering = true;
    room.messageMembers('startAnswering', parameters.conundrumTime);
    timeLeft = setInterval(answerTimeTick.bind(null, room), 1000);
    answeringTimer = setTimeout(timerCallback.bind(null, room), parameters.conundrumTime*1000);
}

function timerCallback(room) {
    answeringFinished(room);
    room.messageMembers('correctAnagram', { 
        solution: room.data.conundrumRound.solution
    });
    room.messageMembers('roundEnded');
}

function answeringFinished(room) {
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
            answeringFinished(room);
            clearTimeout(answeringTimer);
            room.messageMembers('correctAnagram', { 
                winner: { 
                    name: user.name,
                    id: user.id
                }, 
                solution: anagram
            });
            room.messageMembers('roundEnded');
        } else {
            incorrectAnagram(room);
        }
    }
}

function incorrectAnagram(room) {
    var roomUsers = room.getMembers();
    var numAnswers = Object.keys(room.data.possibleAnswers).length;
    if(numAnswers === roomUsers.length) {
        answeringFinished(room);
        clearTimeout(answeringTimer);
        room.messageMembers('correctAnagram', { 
            solution: room.data.conundrumRound.solution
        });
        room.messageMembers('roundEnded');
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
