export const START_GAME = 'START_GAME';
export const SET_LEADER = 'SET_LEADER';

export function startGame() {
    return {
        type: START_GAME
    }
}

export function setLeader(user) {
    return {
        type: SET_LEADER,
        payload: user
    }
}
