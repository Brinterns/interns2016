import * as types from '../actions/types';

const initialState = {
	started: false
};

const game = (state = initialState, action) => {
    switch (action.type) {
        case types.START_GAME:
        	return Object.assign({}, state, {
        		started: true
        	});
        default:
            return state;
    }
};

export default game;