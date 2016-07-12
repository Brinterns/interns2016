import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import lobbyUsers from './lobby-users';
import activeRooms from './active-rooms';
import roomUsers from './room-users';

export default combineReducers({
    lobbyUsers,
    activeRooms,
    roomUsers,
    routing: routerReducer
});
