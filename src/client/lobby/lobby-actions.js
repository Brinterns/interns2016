export function refreshLobby(arg) {
    return {
        type: UPDATE_LOBBY_LIST,
        payload: arg
    };
}

export const UPDATE_LOBBY_LIST = 'UPDATE_LOBBY_LIST';



export function refreshRooms(arg) {
    return {
        type: UPDATE_ROOM_LIST,
        payload: arg
    };
}

export const UPDATE_ROOM_LIST = 'UPDATE_ROOM_LIST';