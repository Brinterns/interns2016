var randomConsonant = require('./random-consonant-picker');
var randomVowel = require('./random-vowel-picker');
var solver = require('../vendor/validation/solver');
var parameters = require('../parameters');
var refreshService = require('../services/refresh-service');
var roundResetService = require('../services/round-reset-service');

function getConsonant(arg, user) {
    var room = user.getRoom();
    var lettersRound = room.data.lettersRound;
    if(lettersRound.letters.length >= parameters.numLetters){
        return;
    }
    if(lettersRound.consonantNum < 6) {
        var consonant = randomConsonant();
        lettersRound.letters.push(consonant);
        lettersRound.consonantNum++;
        room.messageMembers('updateConsonant', consonant);
        checkListLength(user);
    } else {
        room.messageMembers('disableConsonant', true);
    }
}


function getVowel(arg, user) {
    var room = user.getRoom();
    var lettersRound = room.data.lettersRound;
    if(lettersRound.letters.length >= parameters.numLetters){
        return;
    }

    if(lettersRound.vowelNum < 5) {
        var vowel = randomVowel();
        lettersRound.letters.push(vowel);
        lettersRound.vowelNum++;
        room.messageMembers('updateVowel', vowel);
        checkListLength(user);
    } else {
        room.messageMembers('disableVowel', true);
    }
}

function checkListLength(user) {
    var room = user.getRoom();
    var lettersRound = room.data.lettersRound;
    if(lettersRound.consonantNum >= 6){
        room.messageMembers('disableConsonant', true);
        lettersRound.disableConsonant = true;
    }
    if(lettersRound.vowelNum >= 5){
        room.messageMembers('disableVowel', true);
        lettersRound.disableVowel = true;
    }
    if(lettersRound.letters.length >= parameters.numLetters){
        lettersRound.disableConsonant = true;
        lettersRound.disableVowel = true;
        room.messageMembers('disableConsonant', true);
        room.messageMembers('disableVowel', true);
        startAnswering(room);
        return;
    }
}

function answerTimeTick(room) {
    room.data.answerTime--;
}

function startAnswering(room) {
    room.data.answerTime = parameters.answerTime;
    room.data.answering = true;
    room.messageMembers('startAnswering', parameters.answerTime);
    var timeLeft = setInterval(answerTimeTick.bind(null, room), 1000);
    var answeringTimer = setTimeout(answeringFinished.bind(null, room, timeLeft), parameters.answerTime*1000);
}

function answeringFinished(room, timeLeft) {
    room.messageMembers('stopAnswering');
    room.data.answering = false;
    clearInterval(timeLeft);
    startSubmission(room);
}


function submissionTimeTick(room) {
    room.data.submitTime--;
}

var submissionTimers = {};

function startSubmission(room) {
    room.data.submitTime = parameters.submitTime;
    room.data.submitting = true;
    room.messageMembers('startSubmission', parameters.submitTime);
    var timeLeft = setInterval(submissionTimeTick.bind(null, room), 1000);
    var submissionTimer = setTimeout(submissionFinished.bind(null, room, timeLeft), parameters.submitTime*1000);
    submissionTimers[room.id] = {
        timeLeft: timeLeft,
        timer: submissionTimer
    }
}

function submissionFinished(room, timeLeft) {
    room.data.roundEnded = true;
    room.messageMembers('stopSubmission');
    room.data.submitting = false;
    clearInterval(timeLeft);
}

function submitAnswer(index, user) {
    user.message('stopSubmission');
    var room = user.getRoom();
    var answer = room.data.possibleAnswers[user.id] === undefined ? '' : room.data.possibleAnswers[user.id][index];
    var finalAnswerList = room.data.finalAnswerList;
    if(finalAnswerList[user.id] === undefined) {
        finalAnswerList[user.id] = answer;
    }
    var finalAnswerArr = Object.keys(finalAnswerList).reduce((array, userId) => {
        array.push(finalAnswerList[userId]); return array}, []);

    if(finalAnswerArr.length === room.getMembers().length) {
        var answersToScore = Object.keys(finalAnswerList).map((id)=>[id, finalAnswerList[id]]);
        clearTimeout(submissionTimers[room.id].timer);
        submissionFinished(room, submissionTimers[room.id].timeLeft);
        validateAnswers(answersToScore, room.data.lettersRound.letters, room);
    }
}

function validateAnswers(answers, letters, room) {
    answers.sort(function(a, b) {
        return b[1].length - a[1].length;
    });

    var result = solver.solve_letters(letters.join('').toLowerCase());

    result.sort(function(a, b) {
        return b.length - a.length;
    });

    for(var i=0; i<answers.length; i++) {
        if(result.indexOf(answers[i][1].toLowerCase()) !== -1) {
            answers[i].score = (answers[i][1].length === parameters.numLetters ? 2*answers[i][1].length : answers[i][1].length);
        }
        else {
            answers[i].score = 0;
        }
    }

    scoreRound(answers, room);
}

function scoreRound(answers, room) {
    var bestLength = -1;
    for(var i=0; i<answers.length; i++) {
        if(answers[i].score > 0) {
            bestLength = answers[i][1].length;
            break;
        }
    }

    if(bestLength === -1) {
        room.messageMembers('roundEnded');
        sendChosenWordList(room, answers);
        return;
    }

    var bestAnswers = answers.filter(function(answer) {
        return ((answer.score === bestLength || answer.score === 2 * bestLength) && answer.score > 0);
    });

    var results = {};

    bestAnswers.map(function(answer){
        return results[answer[0]] = {
            word: answer[1],
            score: answer.score
        }
    });

    var members = room.getMembers();

    for(var i=0; i<members.length; i++) {
        room.data.scores[members[i].id] += results[members[i].id] === undefined ? 0 : results[members[i].id].score;
    }

    refreshService.refreshRoomUsers(room);
    room.messageMembers('roundEnded');
    sendChosenWordList(room, answers);
}

function allAnswersScored(roomMembers, answers) {
    var numAnswers = Object.keys(answers).length;

    return (roomMembers.length === numAnswers)
}

function sendChosenWordList(room, answers){
    var toSend = {};
    var roomMembers = room.getMembers(true);

    for(var i=0; i<answers.length; i++) {
        for(var j=0; j<roomMembers.length; j++) {
            if(roomMembers[j].id === answers[i][0]) {
                toSend[answers[i][0]] = {
                    name: roomMembers[j].name,
                    word: answers[i][1],
                    score: answers[i].score
                };
                break;
            }
        }
    }
    room.data.roundResults = toSend;

    if(allAnswersScored(roomMembers, toSend)) {
        room.messageMembers('submittedAnswers', toSend);
    }
    roundResetService.startRoundResetTimer(room);
}


function possibleAnswers(answerList, user) {
    var room = user.getRoom();
    room.data.possibleAnswers[user.id] = answerList;
}


module.exports = {
    getConsonant,
    getVowel,
    submitAnswer,
    possibleAnswers
};
