import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import lobby from './lobby/lobby-reducer';
import room from './rooms/room-reducer';
import game from './game/game-reducer';

export default combineReducers({
    lobby,
    room,
    game,
    routing: routerReducer
});
