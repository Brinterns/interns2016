export const UPDATE_LOBBY_LIST = 'UPDATE_LOBBY_LIST';
export const UPDATE_ROOM_LIST = 'UPDATE_ROOM_LIST';

export function refreshLobby(lobbyList) {
    return {
        type: UPDATE_LOBBY_LIST,
        payload: lobbyList
    };
}

export function refreshRooms(roomList) {
    return {
        type: UPDATE_ROOM_LIST,
        payload: roomList
    };
}
