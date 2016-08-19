var cloak = require('cloak');
var randomConsonant = require('./letters/random-consonant-picker');
var randomVowel = require('./letters/random-vowel-picker');
var parameters = require('./parameters');
var solver = require('./vendor/validation/cntdn');
var roomDataService = require('./services/room-data-service');

module.exports = function(expressServer) {
    cloak.configure({
        express: expressServer,
        autoJoinLobby: true,
        reconnectWait: 300,
        lobby: {
            newMember: refreshListener,
            memberLeaves: refreshListener
        },
        room: {
            init: refreshListener,
            newMember: newMember,
            memberLeaves: memberLeaves,
            close: refreshListener
        },
        messages: {
            setUsername: setUsername,
            setUserUp: setUserUp,
            createRoom: createRoom,
            joinRoom: joinRoom,
            leaveRoom: leaveRoom,
            roomDetails: roomDetails,
            startGame: startGame,
            getConsonant: getConsonant,
            getVowel: getVowel,
            checkRoom: checkRoom,
            removeFromRoomList: removeFromRoomList,
            resetScore: resetScore,
            submitAnswer: submitAnswer,
            possibleAnswers: possibleAnswers
        }
    });
    cloak.run();
};

function gameStartedRefresh(user, room) {
    user.message('startGame');
    makeLeader(room.data.leaderIndex, room);
    user.message('resetLetters', room.data.letterList.letters);
    if(room.data.answering) {
        user.message('startAnswering', room.data.answerTime);
    } else {
        user.message('stopAnswering');
    }

    if(room.data.submitting) {
        user.message('startSubmission', room.data.submitTime);
    }
    else {
        user.message('stopSubmission');
    }

    if(room.data.roundEnded) {
        user.message('roundEnded');
        user.message('submittedAnswers', room.data.roundResults);
    }

}

function gameNotStartedRefresh(room) {
    var members = room.getMembers();
    for(var i = 0; i < members.length; i++) {
        if(members[i].id === room.data.creator.id) {
            if(members.length >= parameters.minUserNo && !room.data.started){
                members[i].message('enableStart');
            } else {
                members[i].message('disableStart');
            }
        }
    }
}

function newMember(user) {
    refreshRoomUsers.bind(this)();
    if( this.data.started ) {
        gameStartedRefresh(user, this);
    } else {
        gameNotStartedRefresh(this);
    }
    
    user.message('initialGameParams', {
        answerTime: parameters.answerTime,
    	submitTime: parameters.submitTime
    });
}

function memberLeaves(user) {
    if(user.id === this.data.leaderId){
        setNextLeader(this);
    }
    refreshRoomUsers.bind(this)();
    var members = this.getMembers();
    if(this.getMembers().length >= parameters.minUserNo)
        return;
    for(var i = 0; i < members.length; i++) {
        if(members[i].id === this.data.creator.id) {
            members[i].message('disableStart');
        }
    }
}

function setUserUp(arg, user) {
   if(user.data.name !== undefined){
       user.name = user.data.name;
   }
   if(user.data.id !== undefined){
       user.id = user.data.id;
   }
   var newData = {id: user.id, name: user.name};
   user.message('updateData', newData);
   fireLobbyReload();
}

function setUsername(name, user) {
    user.name = name;
    fireLobbyReload();
}

function createRoom(options, user) {
    var room = cloak.createRoom(options.name);
    room.data = roomDataService.initialRoomData(user);
    room.data.rounds = roomDataService.setRounds(room.data, options);
    user.message('roomIdForJoin', room.id);
    fireRoomListReload();
}

function joinRoom(id, user) {
    var room = cloak.getRoom(id);
    room.data.scores[user.id] = room.data.scores[user.id] === undefined ? 0 : room.data.scores[user.id];
    room.data.userIdList.push(user.id);
    room.addMember(user);
    refreshListener();
}

function isCreator(user, room) {
    if(room.data.creator.id === user.id)
        return true;
    return false;
}

function refreshListener() {
    messageRoundTypes();
    fireLobbyReload();
    fireRoomListReload();
}

function fireLobbyReload() {
    var lobby = cloak.getLobby();
    var list = lobby.getMembers();
    for(var i=0; i<list.length; i++) {
        list[i] = {
            id: list[i].id,
            name: list[i].name,
            data: list[i].data
        };
    }
    lobby.messageMembers('refreshLobby', list);
}

function fireRoomListReload() {
    var rooms = cloak.getRooms(true);
    for(var i = 0; i < rooms.length; i++){
        var currRoom = cloak.getRoom(rooms[i].id);
        rooms[i].data = currRoom.data;
    }
    var lobby = cloak.getLobby();
    lobby.messageMembers('refreshRooms', rooms);
}

function messageRoundTypes() {
    var lobby = cloak.getLobby();
    var roundTypes = parameters.rounds;
    lobby.messageMembers('roundTypes', roundTypes);
}

function refreshRoomUsers(arg) {
    var users = this.getMembers();
    for(var i=0; i<users.length; i++) {
        users[i].data.score = this.data.scores[users[i].id];
        users[i] = {
            id: users[i].id,
            name: users[i].name,
            data: users[i].data
        };
    }
    this.messageMembers('refreshRoomUsers', users);
}

function leaveRoom(arg, user) {
    var room = user.getRoom();
    var leaderIndex = room.data.leaderIndex;
    var userIndex = room.getMembers().indexOf(user);
    delete room.data.scores[user.id];
    if(userIndex < leaderIndex) {
        room.data.leaderIndex--;
    }
    if(userIndex === leaderIndex) {
        room.data.leaderIndex = userIndex===(room.getMembers().length-1) ? 0 : userIndex;
    }
    user.getRoom().removeMember(user);
}

function roomDetails(roomId, user) {
    var room = cloak.getRoom(roomId);
    var response = {id: room.id, name: room.name, data: room.data};
    user.message('roomDetailsResponse', response);
}

function startGame(arg, user) {
    var room = user.getRoom();
    var roomUsers = room.getMembers();
    var leaderIndex = roomUsers.indexOf(user);
    var roundType = room.data.rounds.pop();
    room.data.leaderIndex = leaderIndex;
    room.data.leaderId = user.id;
    room.data.started = true;
    if(roundType === 'L') {
        room.messageMembers('startGame');
        room.messageMembers('roundStarted');
        makeLeader(room.data.leaderIndex, room);
        fireRoomListReload();
    }
}

function makeLeader(leaderIndex, room) {
    if(!room.data.started){
        return;
    }
    var roomMembers = room.getMembers();
    var letterList = room.data.letterList;
    var leader = {
        id: 1,
        name: 'God',
    };
    if(roomMembers.length !== 0) {
        leader = {
            id: roomMembers[leaderIndex].id,
            name: roomMembers[leaderIndex].name,
            data: roomMembers[leaderIndex].data,
            disableConsonant: letterList.disableConsonant,
            disableVowel: letterList.disableVowel
        }
    }
    room.messageMembers('setLeader', leader);
}

function setNextLeader(room) {
    var members = room.getMembers();
    if(members.length === 0)
        return;
    var nextLeader = room.data.leaderIndex;
    nextLeader++;
    nextLeader = nextLeader >= members.length ? 0 : nextLeader;
    makeLeader(nextLeader, room);
    room.data.leaderIndex = nextLeader;
    room.data.leaderId = members[nextLeader].id;
}

function checkRoom(roomId, user) {
    var room = cloak.getRoom(roomId);
    if(!room){
        user.message('allowedToJoin', false);
        return;
    }
    if(!room.data.started){
        user.message('allowedToJoin', true);
        return;
    }
    var allowedUsers = room.data.userIdList;
    for(var i=0; i<allowedUsers.length; i++) {
        if(allowedUsers[i] === user.id){
            user.message('allowedToJoin', true);
            return;
        }
    }
    user.message('allowedToJoin', false);
}

function removeFromRoomList(roomId, user) {
    var room = cloak.getRoom(roomId);
    if(!room) {
        return;
    }
    room.data.userIdList = room.data.userIdList.filter(function(id){
        return id !== user.id;
    });
    delete room.data.scores[user.id];
}

function resetScore(arg, user) {
    user.data.score = undefined;
    refreshListener();
}

function getConsonant(arg, user) {
    var room = user.getRoom();
    var letterList = room.data.letterList;
    if(letterList.letters.length >= parameters.numLetters){
        return;
    }
    if(letterList.consonantNum < 6) {
        var consonant = randomConsonant();
        letterList.letters.push(consonant);
        letterList.consonantNum++;
        room.messageMembers('updateConsonant', consonant);
        checkListLength(user);
    } else {
        user.message('disableConsonant', true);
    }
}


function getVowel(arg, user) {
    var room = user.getRoom();
    var letterList = room.data.letterList;
    if(letterList.letters.length >= parameters.numLetters){
        return;
    }

    if(letterList.vowelNum < 5) {
        var vowel = randomVowel();
        letterList.letters.push(vowel);
        letterList.vowelNum++;
        room.messageMembers('updateVowel', vowel);
        checkListLength(user);
    } else {
        user.message('disableVowel', true);
    }
}

function checkListLength(user) {
    var room = user.getRoom();
    var letterList = room.data.letterList;
    if(letterList.letters.length >= parameters.numLetters){
        letterList.disableConsonant = true;
        letterList.disableVowel = true;
        user.message('disableConsonant', true);
        user.message('disableVowel', true);
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
        validateAnswers(answersToScore, room.data.letterList.letters, room);
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

    refreshRoomUsers.bind(room)();
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
    startRoundResetTimer(room);
}

function startRoundResetTimer(room) {
    var roundResetTimer = setTimeout(nextRound.bind(null, room), 7000);
}

function nextRound(room) {
    setNextLeader(room);
    room.data = roomDataService.newRoundData(room.data);
    var nextRoundType = room.data.rounds.pop();
    if(nextRoundType === 'L'){
        room.messageMembers('resetRound');
        var answeringTimer = setTimeout(function() {
            room.messageMembers('resetFinished');
        }, 2000);
    } else {
        room.messageMembers('gameFinished');
    }
}

function possibleAnswers(answerList, user) {
    var room = user.getRoom();
    room.data.possibleAnswers[user.id] = answerList;
}
