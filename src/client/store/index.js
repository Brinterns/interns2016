let configureStore;

if(process.env.NODE_ENV === 'production') {
    configureStore = require('./configureStore.prod').default;
} else {
    configureStore = require('./configureStore.dev').default;
}

const store = configureStore();
const dispatch = store.dispatch;

export { dispatch };

export default store;
