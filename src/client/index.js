import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import configureStore from './store';
import App from './app';

const store = configureStore();
const app = document.getElementById('app');

render(
    <AppContainer>
        <Provider store={store}>
            <App />
        </Provider>
    </AppContainer>,
    app
);

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
