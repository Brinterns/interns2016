var cloak = require('cloak');

module.exports = function(expressServer) {
    cloak.configure({
        express: expressServer,
        autoJoinLobby: true,
        lobby: {
            newMember: refreshListener,
            memberLeaves: refreshListener
        },
        room: {
            init: refreshListener,
            close: refreshListener
        },
        clientEvents: {
            disconnect: disconnect
        },
        messages: {
            setUsername: setUsername,
            setUserUp: setUserUp,
            createRoom: createRoom,
            joinRoom: joinRoom
        }
    });
    cloak.run();
};

function disconnect(user) {
    user.getRoom().removeMember(user);
    cloak.getLobby().removeMember(user);
}

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
