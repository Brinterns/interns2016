var cloak = require('cloak');

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
            newMember: refreshRoomUsers,
            memberLeaves: refreshRoomUsers,
            close: refreshListener
        },
        messages: {
            setUsername: setUsername,
            setUserUp: setUserUp,
            createRoom: createRoom,
            joinRoom: joinRoom,
            leaveRoom: leaveRoom,
            roomDetails: roomDetails,
            startGame: startGame
        }
    });
    cloak.run();
};

function setUsername(name, user) {
    user.name = name;
    fireLobbyReload();
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

function createRoom(name, user) {
    var room = cloak.createRoom(name);
    room.data.creator = {id: user.id, name: user.name};
    room.data.started = false;
    fireRoomListReload();
}

function joinRoom(id, user) {
    user.data.score = 0;
    var room = cloak.getRoom(id);
    room.addMember(user);
    refreshListener();
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
        users[i] = {
            id: users[i].id,
            name: users[i].name,
            data: users[i].data
        };
    }
    this.messageMembers('refreshRoomUsers', users);
}

function leaveRoom(arg, user) {
    user.data.score = undefined;
    var room = user.getRoom();
    var leaderIndex = room.data.leaderIndex;
    var userIndex = room.getMembers().indexOf(user);
    if(userIndex < leaderIndex) {
        room.data.leaderIndex--;
    }
    if(userIndex === leaderIndex) {
        room.data.leaderIndex = userIndex===(room.getMembers().length-1) ? 0 : userIndex;
    }
    user.getRoom().removeMember(user);
    makeLeader(room.data.leaderIndex, room);
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
    room.data.started = true;
    room.messageMembers('startGame');
    makeLeader(room.data.leaderIndex, room);
    fireRoomListReload();
    gameController(room);
}

function makeLeader(leaderIndex, room) {
    if(!room.data.started){
        return;
    }
    var roomMembers = room.getMembers();
    var leader = {
        id: 1,
        name: 'God',
    };
    if(roomMembers.length !== 0) {
        leader = {
            id: roomMembers[leaderIndex].id,
            name: roomMembers[leaderIndex].name,
            data: roomMembers[leaderIndex].data
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
}

function gameController(room) {
    var roomTimer = setInterval(setNextLeader.bind(null, room), 5000);
}
