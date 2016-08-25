var parameters = require('../parameters');
var evaluator = require('./evaluator');
var refreshService = require('../services/refresh-service');
var roundResetService = require('../services/round-reset-service');

function getRandomNumber(room) {
    room.data.numbersRound.randomNumber = generateRandomNumber(1, 1000);
    room.messageMembers('setRandomNumber', room.data.numbersRound.randomNumber);
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getLarge(arg, user) {
    var room = user.getRoom();
    if(!room.data.numbersRound.disableLarge) {
        var num = room.data.numbersRound.largeNumberList.shift();
        room.messageMembers('updateLarge', num);
        room.data.numbersRound.numbers.push(num);
        room.data.numbersRound.large++;
        checkNumbersLeft(room.data.numbersRound, user);
    }
}

function getSmall(arg, user) {
    var room = user.getRoom();
    if(!room.data.numbersRound.disableSmall) {
        var num = room.data.numbersRound.smallNumberList.shift();
        room.messageMembers('updateSmall', num);
        room.data.numbersRound.numbers.push(num);
        room.data.numbersRound.small++;
        checkNumbersLeft(room.data.numbersRound, user);
    }
}

function checkNumbersLeft(numbersRound, user) {
    var room = user.getRoom();
    if(numbersRound.large >= 4){
        numbersRound.disableLarge = true;
        user.message('disableLarge');
    }
    if(numbersRound.large + numbersRound.small === parameters.numOfNumbers) {
        numbersRound.disableLarge = true;
        numbersRound.disableSmall = true;
        user.message('disableSmall');
        user.message('disableLarge');
        getRandomNumber(room);
        startAnswering(room);
    }
}

function startAnswering(room){
    room.data.answerTime = parameters.answerTime;
    room.data.answering = true;
    room.messageMembers('startAnswering', parameters.answerTime);
    var timeLeft = setInterval(answerTimeTick.bind(null, room), 1000);
    var answeringTimer = setTimeout(answeringFinished.bind(null, room, timeLeft), parameters.answerTime*1000);
}

function answerTimeTick(room) {
    room.data.answerTime--;
}

function answeringFinished(room, timeLeft) {
    room.messageMembers('stopAnswering');
    room.data.answering = false;
    clearInterval(timeLeft);
    room.messageMembers('getEquation');
}

function submitEquation(equation, user) {
    var room = user.getRoom();
    room.data.finalAnswerList[user.id] = {
        answer: equation
    };
    if(Object.keys(room.data.finalAnswerList).length === room.getMembers().length) {
        evaluateAnswers(room.data.finalAnswerList, room);
    }
}

function evaluateAnswers(answers, room) {
    var allowedNumbers = room.data.numbersRound.numbers;
    for(var i in answers) {
        answers[i].eval = evaluator(answers[i].answer, Array.from(allowedNumbers));
    }
    scoreAnswers(answers, room);
}

function scoreAnswers(answers, room) {
    var target = room.data.numbersRound.randomNumber;
    for(var i in answers) {
        if(answers[i].eval === null) {
            answers[i].distance = Number.MAX_VALUE;
            answers[i].score = 0;
        } else if(answers[i].eval === target) {
            answers[i].distance = 0;
            answers[i].score = 10;
        } else if(Math.abs(answers[i].eval - target) <= 5) {
            answers[i].distance = Math.abs(answers[i].eval - target);
            answers[i].score = 7;
        } else if(Math.abs(answers[i].eval - target) <= 10) {
            answers[i].distance = Math.abs(answers[i].eval - target);
            answers[i].score = 5;
        } else {
            answers[i].distance = Math.abs(answers[i].eval - target);
            answers[i].score = 0;
        }
    }
    var scoresToSort = [];
    Object.keys(answers).map(function(item) {
        scoresToSort.push([answers[item].distance, item]);
    });
    scoresToSort.sort(function(first, second) {
        return first[0]-second[0];
    });
    var best = scoresToSort[0][0];
    var bestScores = scoresToSort.filter(function(item) {
        return item[0] === best
    });
    for(var i=0 ; i < bestScores.length; i++) {
        room.data.scores[bestScores[i][1]] += answers[bestScores[i][1]].score;
    }
    refreshService.refreshRoomUsers(room);
    room.messageMembers('roundEnded');
    sendAnswersBack(room, answers);
}

function sendAnswersBack(room, answers){
    var toSend = {};
    var roomMembers = room.getMembers(true);

    for(var i in answers) {
        for(var j=0; j<roomMembers.length; j++) {
            if(roomMembers[j].id === i) {
                toSend[i] = {
                    name: roomMembers[j].name,
                    word: answers[i].answer,
                    score: answers[i].score,
                    distance: answers[i].distance
                };
                break;
            }
        }
    }
    room.data.roundResults = toSend;

    room.messageMembers('submittedAnswers', toSend);

    roundResetService.startRoundResetTimer(room);
}


module.exports =  {
    generateRandomNumber,
    getRandomNumber,
    getLarge,
    getSmall,
    submitEquation
}
