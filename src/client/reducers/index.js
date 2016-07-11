import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import lobbyUsers from './lobby-users';
import activeRooms from './active-rooms';

export default combineReducers({
    lobbyUsers,
    activeRooms,
    routing: routerReducer
});
