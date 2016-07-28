import { createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware, push } from 'react-router-redux';

import rootReducer from '../root-reducer';
const middleware = routerMiddleware(browserHistory);

export default (initialState) => createStore(
    rootReducer,
    initialState,
    window.devToolsExtension && window.devToolsExtension(),
    applyMiddleware(middleware)
);
