import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import RoomPage from './room-page';
import configureStore from '../store';

let store;
var data;
describe('<RoomCreator />', () => {
    beforeEach(() =>{
        store = configureStore();
    });

    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['connected', 'message']);
    });

    it('contains "Room: name" heading', () => {
        cloak.connected.and.returnValue(true);
        data = '12345&One';
        const wrapper = mount(
            <Provider store={store}>
                <RoomPage params={{data: data}}/>
            </Provider>
        );
        expect(wrapper.find('h1').text()).toEqual('Room: One');
    });

    it('contains "Start Game" button', () => {
        data = '';
        const wrapper = mount(
            <Provider store={store}>
                <RoomPage params={{data: data}}/>
            </Provider>
        );
        expect(wrapper.find('#start-game').text()).toEqual('Start Game');
    });

    it('contains "Leave Room" button', () => {
        data = '';
        const wrapper = mount(
            <Provider store={store}>
                <RoomPage params={{data: data}}/>
            </Provider>
        );
        expect(wrapper.find('#leave-room').text()).toEqual('Leave Room');
    });
});
