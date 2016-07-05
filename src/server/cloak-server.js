var cloak = require('cloak');

module.exports = function(expressServer) {
    cloak.configure({
        express: expressServer,
        autoJoinLobby: true,
        lobby: {
            newMember: () => {
                fireLobbyReload();
            },
            memberLeaves: () => {
                fireLobbyReload();
            }
        },
        clientEvents: {
            disconnect: (user) => {
                cloak.getLobby().removeMember(user);
            }
        },
        messages: {
            setUsername: (arg, user) => {
                user.name = arg;
                fireLobbyReload();
            }
        }

    });

    cloak.run();
};

function fireLobbyReload(){
    var lobby = cloak.getLobby();
    var list = lobby.getMembers(true);
    lobby.messageMembers('refreshLobby', list);
}
