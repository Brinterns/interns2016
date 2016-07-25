import config from '../config/config';
import storageService from '../services/storage-service';

export default {
    configureAndRun,
    messageSetUsername,
    messageCreateRoom,
    messageJoinRoom,
    messageLeaveRoom,
    getRoomData,
    isConnected,
    messageStartGame,
    setStartGame,
    setLeaderDispatch,
    messageGetConsonant,
    setConsonantDispatch,
    messageGetVowel,
    setVowelDispatch,
    setDisableConsonantDispatch,
    setDisableVowelDispatch
};

let roomDataDispatch;
let startGameDispatch;
let leaderDispatch;
let consonantDispatch;
let vowelDispatch;
let disableConsonantDispatch;
let disableVowelDispatch;

function configureAndRun(refreshLobby, refreshRooms, refreshRoomUsers) {
    cloak.configure({
        serverEvents: {
            begin: () => {
                cloak.message('setUserUp');
            }
        },
        messages: {
            refreshLobby: lobbyList => {
                refreshLobby(lobbyList);
            },
            updateData: user => {
                storageService.storeId(user.id);
                storageService.storeName(user.name);
            },
            refreshRooms: roomList => {
                refreshRooms(roomList);
            },
            refreshRoomUsers: roomUserList => {
                refreshRoomUsers(roomUserList);
            },
            roomDetailsResponse: roomDetails => {
                roomDataDispatch(roomDetails);
            },
            startGame: () => {
                startGameDispatch();
            },
            setLeader: user => {
                leaderDispatch(user);
            },
            updateConsonant: consonant => {
                consonantDispatch(consonant);
            },
            updateVowel: vowel => {
                vowelDispatch(vowel);
            },
            disableConsonant: bool => {
                disableConsonantDispatch(bool);
            },
            disableVowel: bool => {
                disableVowelDispatch(bool);
            }
        },
        initialData: storageService.getUser()
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
    cloak.message('startGame');
}

function setStartGame(dispatch) {
    startGameDispatch = dispatch;
}

function setLeaderDispatch(dispatch) {
    leaderDispatch = dispatch;
}

function messageGetConsonant() {
    cloak.message('getConsonant');
}

function setConsonantDispatch(dispatch) {
    consonantDispatch = dispatch;
}

function messageGetVowel() {
    cloak.message('getVowel');
}

function setVowelDispatch(dispatch) {
    vowelDispatch = dispatch;
}

function setDisableConsonantDispatch(dispatch) {
    disableConsonantDispatch = dispatch;
}

function setDisableVowelDispatch(dispatch) {
    disableVowelDispatch = dispatch;
}