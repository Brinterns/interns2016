import * as types from '../actions/types';

export default (state = [], action) => {
    switch (action.type) {
        case types.UPDATE_LOBBY_LIST: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};
