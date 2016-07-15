import * as types from '../actions/types';

export default (state = false, action) => {
    switch (action.type) {
        case types.START_GAME: {
            return true;
        }
        default: {
            return state;
        }
    }
};
