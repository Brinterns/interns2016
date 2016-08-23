var cloak = require('cloak');
var parameters = require('./parameters');
var roomDataService = require('./services/room-data-service');
var numbersRound = require('./numbers-round/numbers-round');
var refreshService = require('./services/refresh-service');
var lettersRound = require('./letters-round/letters-round');
var leaderService = require('./services/leader-service');

var fiveMinutes = 300000;
module.exports = function(expressServer) {
    cloak.configure({
        express: expressServer,
        autoJoinLobby: true,
        reconnectWait: 300,
        pruneEmptyRooms: fiveMinutes,
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
            checkRoom: checkRoom,
            resetScore: resetScore,
            removeFromRoomList: removeFromRoomList,

            getConsonant: lettersRound.getConsonant,
            getVowel: lettersRound.getVowel,
            submitAnswer: lettersRound.submitAnswer,
            possibleAnswers: lettersRound.possibleAnswers,


            refreshRoomList: refreshRoomList,
            getLarge: numbersRound.getLarge,
            getSmall: numbersRound.getSmall
        }
    });
    cloak.run();
};

function refreshRoomList(arg, user) {
    refreshListener();
}

function gameStartedRefresh(user, room) {
    user.message('startGame');
    leaderService.makeLeader(room.data.leaderIndex, room);
    user.message('resetLetters', room.data.lettersRound.letters);
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
    refreshService.refreshRoomUsers(this);
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
        leaderService.setNextLeader(this);
    }
    refreshService.refreshRoomUsers(this);
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
    var rooms = cloak.getRooms();
    rooms=cloak.getRooms(true);
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
    var nextRoundType = room.data.rounds.shift();
    room.data.leaderIndex = leaderIndex;
    room.data.leaderId = user.id;
    room.data.started = true;
    room.messageMembers('nextRoundType', nextRoundType);
    room.messageMembers('startGame');
    room.messageMembers('roundStarted');
    leaderService.makeLeader(room.data.leaderIndex, room);
    fireRoomListReload();
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
