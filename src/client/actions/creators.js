import * as types from './types';

export default function refreshLobby(arg) {
    return {
        type: types.UPDATE_LOBBY_LIST,
        payload: arg
    };
}
