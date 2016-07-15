import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store';
import App from './app';
import RoomPage from './rooms/room-page'

const store = configureStore();
const app = document.getElementById('app');
const history = syncHistoryWithStore(browserHistory, store);

render((
    <AppContainer>
        <Provider store={store}>
            <Router history={history}>
                <Route path="/" component={App} />
                    <Route path="room/:data" component={RoomPage} />
            </Router>
        </Provider>
    </AppContainer>
), app)

if(module.hot) {
    module.hot.accept('./app', () => {
        const NextApp = require('./app').default;
        render(
            <AppContainer>
                <Provider store={store}>
                    <NextApp />
                </Provider>
            </AppContainer>,
            app
        );
    });
}
