import config from '../config/config';
import storageService from '../services/storage-service';
import { dispatch } from '../store';
import {
    startGame,
    setLeader,
    getConsonant, 
    getVowel, 
    disableConsonant, 
    disableVowel,
    startAnswering,
    stopAnswering
} from '../game/game-actions';

import { getRoomDetails, refreshRoomUsers } from '../rooms/room-actions';

import { refreshLobby, refreshRooms} from '../lobby/lobby-actions';

export default {
    configureAndRun,
    messageSetUsername,
    messageCreateRoom,
    messageJoinRoom,
    messageLeaveRoom,
    getRoomData,
    isConnected,
    messageStartGame,
    messageGetConsonant,
    messageGetVowel
};

function configureAndRun() {
    cloak.configure({
        serverEvents: {
            begin: () => {
                cloak.message('setUserUp');
            }
        },
        messages: {
            refreshLobby: lobbyList => {
                dispatch(refreshLobby(lobbyList));
            },
            updateData: user => {
                storageService.storeId(user.id);
                storageService.storeName(user.name);
            },
            refreshRooms: roomList => {
                dispatch(refreshRooms(roomList));
            },
            refreshRoomUsers: roomUserList => {
                dispatch(refreshRoomUsers(roomUserList));
            },
            roomDetailsResponse: roomDetails => {
                dispatch(getRoomDetails(roomDetails));
            },
            startGame: () => {
                dispatch(startGame());
            },
            setLeader: user => {
                dispatch(setLeader(user));
            },
            updateConsonant: consonant => {
                dispatch(getConsonant(consonant));
            },
            updateVowel: vowel => {
                dispatch(getVowel(vowel));
            },
            disableConsonant: bool => {
                dispatch(disableConsonant(bool));
            },
            disableVowel: bool => {
                dispatch(disableVowel(bool));
            },
            startAnswering: () => {
                dispatch(startAnswering());
            },
            stopAnswering: () => {
                dispatch(stopAnswering());
            }
        },
        initialData: {
            name: storageService.getUser().name,
            id: storageService.getUser().id,
            score: undefined
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

function isConnected() {
    return cloak.connected();
}

function getRoomData(roomId) {
    cloak.message('roomDetails', roomId);
}

function messageStartGame() {
    cloak.message('startGame');
}

function messageGetConsonant() {
    cloak.message('getConsonant');
}

function messageGetVowel() {
    cloak.message('getVowel');
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

function setStartAnsweringDispatch(dispatch) {
    startAnsweringDispatch = dispatch;
}

function setStopAnsweringDispatch(dispatch) {
    stopAnsweringDispatch = dispatch;
}