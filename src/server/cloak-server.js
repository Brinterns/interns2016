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
            disconnect: (user) => {
                user.getRoom().removeMember(user);
                cloak.getLobby().removeMember(user);
            }
        },
        messages: {
            setUsername: (arg, user) => {
                user.name = arg;
                fireLobbyReload();
            },
            setUserUp: (arg, user) => {
                if(user.data.name !== undefined){
                    user.name = user.data.name;
                }
                if(user.data.id !== undefined){
                    user.id = user.data.id;
                }
                var newData = {id: user.id, name: user.name};
                user.message('updateData', newData);
                fireLobbyReload();
            },
            createRoom: (arg, user) => {
                cloak.createRoom(arg);
                fireRoomListReload();
            }
        }

    });

    cloak.run();
};

function refreshListener(){
    fireLobbyReload();
    fireRoomListReload();
}

function fireLobbyReload(){
    var lobby = cloak.getLobby();
    var list = lobby.getMembers(true);
    lobby.messageMembers('refreshLobby', list);
}

function fireRoomListReload(){
    var rooms = cloak.getRooms(true);
    var lobby = cloak.getLobby();
    lobby.messageMembers('refreshRooms', rooms);
}
