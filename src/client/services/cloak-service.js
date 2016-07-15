import config from '../config/config';
import { storeName, storeId, getUser } from '../services/storage-service';

export {
    configureAndRun,
    messageSetUsername,
    messageCreateRoom,
    messageJoinRoom,
    messageLeaveRoom,
    getRoomData,
    isConnected,
    messageStartGame,
    setStartGame
};

let roomDataDispatch;
let startGameDispatch;

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
                storeId(arg.id);
                storeName(arg.name);
            },
            refreshRooms: arg => {
                refreshRooms(arg);
            },
            refreshRoomUsers: arg => {
                refreshRoomUsers(arg);
            },
            roomDetailsResponse: arg => {
                roomDataDispatch(arg);
            },
            startGame: arg => {
                startGameDispatch(arg);
            }
        },
        initialData: getUser()
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

function isConnected() {
    return cloak.connected();
}

function getRoomData(roomId, dispatch) {
    roomDataDispatch = dispatch;
    cloak.message('roomDetails', roomId);
}

function messageStartGame() {
    cloak.message('startGame', true);
}

function setStartGame(dispatch) {
    startGameDispatch = dispatch;
}
