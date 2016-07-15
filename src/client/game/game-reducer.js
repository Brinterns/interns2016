import { START_GAME } from './game-actions';

const initialState = {
	started: false
};

const game = (state = initialState, action) => {
    switch (action.type) {
        case START_GAME:
        	return Object.assign({}, state, {
        		started: true
        	});
        default:
            return state;
    }
};

export default game;