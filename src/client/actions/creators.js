import * as types from './types';

function refreshLobby(lobbyUsers) {
    return {
        type: types.UPDATE_LOBBY_LIST,
        payload: lobbyUsers
    };
}

export { refreshLobby };
