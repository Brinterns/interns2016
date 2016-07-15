export function refreshRoomUsers(roomUsers) {
    return {
        type: UPDATE_ROOM_USERS,
        payload: roomUsers
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