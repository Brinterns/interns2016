import config from '../config/config';

export {
    configureAndRun,
    messageSetUsername,
    messageCreateRoom,
    messageJoinRoom,
    messageLeaveRoom
};

function configureAndRun(refreshLobby, refreshRooms, refreshRoomUsers) {
    cloak.configure({
        serverEvents: {
            begin: () => {
                cloak.message('setUserUp');
            }
        },
        messages: {
            refreshLobby: arg => {
                refreshLobby(arg);
            },
            updateData: arg => {
                localStorage.id = arg.id;
                localStorage.name = arg.name;
            },
            refreshRooms: arg => {
                refreshRooms(arg);
            },
            refreshRoomUsers: arg => {
                refreshRoomUsers(arg);
            }
        },
        initialData: {
            id: localStorage.id,
            name: localStorage.name
        }
    });
    cloak.run(config.cloakAddress);
}

function messageSetUsername(username) {
    cloak.message('setUsername', username);
}

function messageCreateRoom(roomname) {
    cloak.message('createRoom', roomname);
}   

function messageJoinRoom(roomId) {
    cloak.message('joinRoom', roomId);
}

function messageLeaveRoom() {
    cloak.message('leaveRoom');
}