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
