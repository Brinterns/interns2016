import config from '../config/config';
import storageService from '../services/storage-service';
import { dispatch } from '../store';
import {
    startGame,
    setLeader,
    getConsonantDispatch, 
    getVowelDispatch, 
    disableConsonantDispatch, 
    disableVowelDispatch 
} from '../game/game-actions';

import { getRoomDetails } from '../rooms/room-actions';

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

let roomDataDispatch;

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
                dispatch(getRoomDetails(roomDetails));
            },
            startGame: () => {
                dispatch(startGame());
            },
            setLeader: user => {
                dispatch(setLeader(user));
            },
            updateConsonant: consonant => {
                dispatch(getConsonantDispatch(consonant));
            },
            updateVowel: vowel => {
                dispatch(getVowelDispatch(vowel));
            },
            disableConsonant: bool => {
                dispatch(disableConsonantDispatch(bool));
            },
            disableVowel: bool => {
                dispatch(disableVowelDispatch(bool));
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
