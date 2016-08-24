import config from '../config/config';
import storageService from '../services/storage-service';
import router from '../services/routing-service';
import { dispatch } from '../store';
import {
    startGame,
    setLeader,
    disableStart,
    roundEnded,
    roundStarted,
    resetRound,
    resetFinished,
    gameParameters,
    gameFinished,
    nextRoundType
} from '../game/game-actions';

import {
    getConsonant,
    getVowel,
    disableConsonant,
    disableVowel,
    startAnswering,
    stopAnswering,
    startSubmission,
    stopSubmission,
    submittedAnswers,
    resetLetters
} from '../game/letter-round-actions';

import {
    setRandomNumber,
    getLarge,
    getSmall,
    disableLarge,
    disableSmall,
    getEquation
} from '../game/number-round-actions';

import { getRoomDetails, refreshRoomUsers } from '../rooms/room-actions';

import { refreshLobby, refreshRooms, roundTypes} from '../lobby/lobby-actions';

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
    messageGetVowel,
    messageRemoveFromRoomList,
    resetScore,
    messageAnswers,
    messageAnswerToSubmit,
    messageGetRandomNumber,
    messageGetLarge,
    messageGetSmall,
    messageSendEquation
};

const cloak = window.cloak;
delete window.cloak;

function configureAndRun(roomId) {
    cloak.configure({
        serverEvents: {
            begin: () => {
                cloak.message('setUserUp');
                if(roomId !== undefined) {
                    cloak.message('checkRoom', roomId);
                }
            },
            roomDeleted: () => {
                cloak.message('refreshRoomList');
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
            resetLetters: letters => {
                dispatch(resetLetters(letters));
            },
            disableConsonant: bool => {
                dispatch(disableConsonant(bool));
            },
            disableVowel: bool => {
                dispatch(disableVowel(bool));
            },
            startAnswering: time => {
                dispatch(startAnswering(time));
            },
            stopAnswering: () => {
                dispatch(stopAnswering());
            },
            enableStart: () =>{
                dispatch(disableStart(false));
            },
            disableStart: () =>{
                dispatch(disableStart(true));
            },
            allowedToJoin: bool =>{
                if(bool) {
                    messageJoinRoom(roomId);
                    getRoomData(roomId);
                } else {
                    cloak.stop();
                    router.navigateToLobby();
                }
            },
            startSubmission: time => {
                dispatch(startSubmission(time));
            },
            stopSubmission: () => {
                dispatch(stopSubmission());
            },
            submittedAnswers: finalAnswerList => {
                dispatch(submittedAnswers(finalAnswerList));
            },
            roundEnded: () => {
                dispatch(roundEnded());
            },
            roundStarted: () => {
                dispatch(roundStarted());
            },
            resetRound: () => {
                dispatch(resetRound());
            },
            resetFinished: () => {
                dispatch(resetFinished());
            },
            initialGameParams: (params) => {
                dispatch(gameParameters(params));
            },
            gameFinished: () => {
                dispatch(gameFinished());
            },
            roomIdForJoin: roomId => {
                router.navigateToRoom(roomId);
            },
            roundTypes: types => {
                dispatch(roundTypes(types));
            },
            nextRoundType: type => {
                dispatch(nextRoundType(type));
            },
            setRandomNumber: number => {
                dispatch(setRandomNumber(number));
            },
            updateLarge: number => {
                dispatch(getLarge(number));
            },
            updateSmall: number => {
                dispatch(getSmall(number));
            },
            disableLarge: () => {
                dispatch(disableLarge());
            },
            disableSmall: () => {
                dispatch(disableSmall());
            },
            getEquation: () => {
                dispatch(getEquation());
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

function messageCreateRoom(roomOptions) {
    cloak.message('createRoom', roomOptions);
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

function messageRemoveFromRoomList(roomId) {
    cloak.message('removeFromRoomList', roomId);
}

function resetScore() {
    cloak.message('resetScore');
}

function messageAnswers(answerList) {
    cloak.message('possibleAnswers', answerList);
}

function messageAnswerToSubmit(index) {
    cloak.message('submitAnswer', index);
}

function messageGetRandomNumber() {
    cloak.message('getRandomNumber');
}

function messageGetLarge() {
    cloak.message('getLarge');
}

function messageGetSmall() {
    cloak.message('getSmall');
}

function messageSendEquation(equation) {
    cloak.message('submitEquation', equation);
}
