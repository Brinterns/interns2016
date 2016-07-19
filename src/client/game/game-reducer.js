import { START_GAME, SET_LEADER } from './game-actions';

const initialState = {
	started: false,
	leader: 'undefined'
};

const game = (state = initialState, action) => {
    switch (action.type) {
        case START_GAME:
        	return Object.assign({}, state, {
        		started: true
        	});
		case SET_LEADER:
			return Object.assign({}, state, {
				leader: action.payload.name
			});
        default:
            return state;
    }
};

export default game;
