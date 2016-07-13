import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import lobbyUsers from './lobby/lobby-users-reducer';
import activeRooms from './lobby/active-rooms-reducer';
import roomUsers from './rooms/room-users-reducer';

export default combineReducers({
    lobbyUsers,
    activeRooms,
    roomUsers,
    routing: routerReducer
});
