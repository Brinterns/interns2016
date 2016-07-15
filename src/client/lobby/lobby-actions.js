export function refreshLobby(lobbyList) {
    return {
        type: UPDATE_LOBBY_LIST,
        payload: lobbyList
    };
}

export const UPDATE_LOBBY_LIST = 'UPDATE_LOBBY_LIST';



export function refreshRooms(roomList) {
    return {
        type: UPDATE_ROOM_LIST,
        payload: roomList
    };
}

export const UPDATE_ROOM_LIST = 'UPDATE_ROOM_LIST';