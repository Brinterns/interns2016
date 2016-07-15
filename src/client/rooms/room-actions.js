export function refreshRoomUsers(arg) {
    return {
        type: UPDATE_ROOM_USERS,
        payload: arg
    };
}

export const UPDATE_ROOM_USERS = 'UPDATE_ROOM_USERS';



export function getRoomDetails(roomData) {
    return {
        type: GET_ROOM_DATA,
        payload: roomData
    }
}

export const GET_ROOM_DATA = 'GET_ROOM_DATA';