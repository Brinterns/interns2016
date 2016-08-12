export const UPDATE_LOBBY_LIST = 'UPDATE_LOBBY_LIST';
export const UPDATE_ROOM_LIST = 'UPDATE_ROOM_LIST';
export const UPDATE_LETTER_SLIDER = 'UPDATE_LETTER_SLIDER';


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

export function updateLetterSlider(value) {
    return {
        type: UPDATE_LETTER_SLIDER,
        payload: value
    }
}