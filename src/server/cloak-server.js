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
    var list = lobby.getMembers(true);
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
    this.messageMembers('refreshRoomUsers', this.getMembers(true));
}

function leaveRoom(arg, user) {
    user.getRoom().removeMember(user);
}

function roomDetails(roomId, user) {
    var room = cloak.getRoom(roomId);
    var response = {id: room.id, name: room.name, data: room.data};
    user.message('roomDetailsResponse', response);
}

function startGame(arg, user) {
    var room = user.getRoom();
    room.data.started = true;
    room.messageMembers('startGame', true);
    fireRoomListReload();
}
