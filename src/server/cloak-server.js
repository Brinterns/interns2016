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
            roomDetails: roomDetails
        }
    });
    cloak.run();
};

function setUsername(arg, user) {
    user.name = arg;
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

function createRoom(arg, user) {
    cloak.createRoom(arg);
    fireRoomListReload();
}

function joinRoom(arg, user) {
    var room = cloak.getRoom(arg);
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
    var lobby = cloak.getLobby();
    lobby.messageMembers('refreshRooms', rooms);
}

function refreshRoomUsers(arg) {
    this.messageMembers('refreshRoomUsers', this.getMembers(true));
}

function leaveRoom(arg, user) {
    user.getRoom().removeMember(user);
}

function roomDetails(arg, user) {
    arg.dispatch(cloak.getRoom(arg.id));
}
