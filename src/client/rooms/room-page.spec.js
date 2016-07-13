import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import RoomPage from './room-page';
import configureStore from '../store';

let store;
describe('<RoomCreator />', () => {
    beforeEach(() =>{
        store = configureStore();
    });

    it('contains "Room: name" heading', () => {
        const wrapper = mount(
            <Provider store={store}>
                <RoomPage params={{id: 'one'}}/>
            </Provider> 
        );
        expect(wrapper.find('h1').text()).toEqual('Room: one');
    });

    it('contains "Start Game" button', () => {
        const wrapper = mount(
            <Provider store={store}>
                <RoomPage params={{id: ''}}/>
            </Provider> 
        );
        expect(wrapper.find('#start-game').text()).toEqual('Start Game');
    });

    it('contains "Leave Room" button', () => {
        const wrapper = mount(
            <Provider store={store}>
                <RoomPage params={{id: ''}}/>
            </Provider> 
        );
        expect(wrapper.find('#leave-room').text()).toEqual('Leave Room');
    });
});
