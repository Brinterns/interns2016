export const UPDATE_LOBBY_LIST = 'UPDATE_LOBBY_LIST';
export const UPDATE_ROOM_LIST = 'UPDATE_ROOM_LIST';
export const UPDATE_LETTER_SLIDER = 'UPDATE_LETTER_SLIDER';
export const UPDATE_NUMBER_SLIDER = 'UPDATE_NUMBER_SLIDER';

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

export function updateNumberSlider(value) {
    return {
        type: UPDATE_NUMBER_SLIDER,
        payload: value
    }
}