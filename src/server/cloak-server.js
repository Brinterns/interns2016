var cloak = require('cloak');
var randomConsonant = require('./letters/random-consonant-picker');
var randomVowel = require('./letters/random-vowel-picker');
var gameParameters = require('./game-parameters');
var solver = require('./validation/cntdn');

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

function newMember(user) {
    refreshRoomUsers.bind(this)();
    var members = this.getMembers();
    if( this.data.started ) {
        user.message('startGame');
        makeLeader(this.data.leaderIndex, this);
        user.message('resetLetters', this.data.letterList.letters);
        if(this.data.answering) {
            user.message('startAnswering', this.data.answerTime);
        } else {
            user.message('stopAnswering');
            if(this.data.submitting) {
                user.message('startSubmission', this.data.submitTime);
            }
            else {
                user.message('stopSubmission');
            }
        }
    }
    for(var i = 0; i < members.length; i++) {
        if(members[i].id === this.data.creator.id) {
            if(this.getMembers().length >= gameParameters.minUserNo && !this.data.started){
                members[i].message('enableStart');
            } else {
                members[i].message('disableStart');
            }
        }
    }
}

function memberLeaves(user) {
    if(user.id === this.data.leaderId){
        setNextLeader(this);
    }
    refreshRoomUsers.bind(this)();
    var members = this.getMembers();
    if(this.getMembers().length >= gameParameters.minUserNo)
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

function createRoom(name, user) {
    var room = cloak.createRoom(name);
    room.data.creator = {id: user.id, name: user.name};
    room.data.userIdList = [];
    room.data.started = false;
    room.data.answering = false;
    room.data.submitting = false;
    room.data.scores = [];
    room.data.letterList = {
        letters: [],
        consonantNum: 0,
        vowelNum: 0,
        disableConsonant: false,
        disableVowel: false
    };
    room.data.possibleAnswers = {};
    room.data.finalAnswerList = {};
    fireRoomListReload();
}

function joinRoom(id, user) {
    var room = cloak.getRoom(id);
    room.data.scores[user.id] = 0;
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
    room.data.leaderIndex = leaderIndex;
    room.data.leaderId = user.id;
    room.data.started = true;
    room.messageMembers('startGame');
    makeLeader(room.data.leaderIndex, room);
    fireRoomListReload();
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
    if(letterList.letters.length >= gameParameters.numLetters){
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
    if(letterList.letters.length >= gameParameters.numLetters){
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
    if(letterList.letters.length >= gameParameters.numLetters){
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
    room.data.answerTime = gameParameters.answerTime;
    room.data.answering = true;
    room.messageMembers('startAnswering', gameParameters.answerTime);
    var timeLeft = setInterval(answerTimeTick.bind(null, room), 1000);
    var answeringTimer = setTimeout(answeringFinished.bind(null, room, timeLeft), gameParameters.answerTime*1000);
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
    room.data.submitTime = gameParameters.submitTime;
    room.data.submitting = true;
    room.messageMembers('startSubmission', gameParameters.submitTime);
    var timeLeft = setInterval(submissionTimeTick.bind(null, room), 1000);
    var submissionTimer = setTimeout(submissionFinished.bind(null, room, timeLeft), gameParameters.submitTime*1000);
    submissionTimers[room.id] = {
        timeLeft: timeLeft,
        timer: submissionTimer
    }
}

function submissionFinished(room, timeLeft) {
    room.messageMembers('stopSubmission');
    room.data.submitting = false;
    clearInterval(timeLeft);
}

function submitAnswer(index, user) {
    var room = user.getRoom();
    var answer = room.data.possibleAnswers[user.id][index];
    var finalAnswerList = room.data.finalAnswerList;
    

    if(finalAnswerList[user.id] === undefined) {
        finalAnswerList[user.id] = answer;
    }
    var finalAnswerArr = Object.keys(finalAnswerList).reduce((array, userId) => {
        array.push(finalAnswerList[userId]); return array}, []);

    room.messageMembers('submittedAnswer', finalAnswerArr);

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
            answers[i].score = (answers[i][1].length === gameParameters.numLetters ? 2*answers[i][1].length : answers[i][1].length); 
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
}

function possibleAnswers(answerList, user) {
    var room = user.getRoom();
    room.data.possibleAnswers[user.id] = answerList;
}
