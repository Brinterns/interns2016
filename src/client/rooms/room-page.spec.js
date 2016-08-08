import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';

import RoomPage from './room-page';
import store from '../store';

var data;
describe('<RoomPage />', () => {

    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'connected', 'message']);
    });

    it('contains "Start" button', () => {
        data = '';
        const wrapper = mount(
            <Provider store={store}>
                <RoomPage params={{data: data}}/>
            </Provider>
        );
        expect(wrapper.find('#start-game').text()).toEqual('Start');
    });

    it('contains "Leave" button', () => {
        data = '';
        const wrapper = mount(
            <Provider store={store}>
                <RoomPage params={{data: data}}/>
            </Provider>
        );
        expect(wrapper.find('#leave-room').text()).toEqual('Leave');
    });
});
