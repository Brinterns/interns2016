import * as types from './types';

export function refreshLobby(arg) {
    return {
        type: types.UPDATE_LOBBY_LIST,
        payload: arg
    };
}

export function refreshRooms(arg) {
    return {
        type: types.UPDATE_ROOM_LIST,
        payload: arg
    };
}

export function refreshRoomUsers(arg) {
    return {
        type: types.UPDATE_ROOM_USERS,
        payload: arg
    };
}
