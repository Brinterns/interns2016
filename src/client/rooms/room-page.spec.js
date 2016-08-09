import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';

import RoomPage from './room-page';
import store from '../store';

describe('<RoomPage />', () => {
    let data;
    let cloakService;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'connected', 'message']);
        cloakService = jasmine.createSpyObj('cloakService',['configureAndRun', 'isConnected', 'messageJoinRoom', 'getRoomData',
            'messageRemoveFromRoomList', 'messageLeaveRoom']);
        RoomPage.__Rewire__('cloakService', cloakService);  
    });

    afterEach(() => {
        RoomPage.__ResetDependency__('cloakService');
    })

    it('contains "Start" button', () => {
        data = '';
        let wrapper = mount(
            <Provider store={store}>
                <RoomPage params={{data: data}}/>
            </Provider>
        );

        expect(wrapper.find('#start-game').text()).toEqual('Start');
    });

    it('contains "Leave" button', () => {
        data = '';
        let wrapper = mount(
            <Provider store={store}>
                <RoomPage params={{data: data}}/>
            </Provider>
        );

        expect(wrapper.find('#leave-room').text()).toEqual('Leave');
    });

    describe('componentWillMount', () => {
        it('if user is connected to the server it tries to join the room', () => {
            data = '1234';
            cloakService.isConnected.and.returnValue(true);
            let wrapper = mount(
                <Provider store={store}>
                    <RoomPage params={{data: data}}/>
                </Provider>
            );

            expect(cloakService.messageJoinRoom).toHaveBeenCalledWith(data);
        });

        it('if user is connected to the server it tries to get the room data', () => {
            data = '1234';
            cloakService.isConnected.and.returnValue(true);
            let wrapper = mount(
                <Provider store={store}>
                    <RoomPage params={{data: data}}/>
                </Provider>
            );

            expect(cloakService.getRoomData).toHaveBeenCalledWith(data);
        });

        it('if user is not connected to the server it tries establish a connection', () => {
            data = '1234';
            cloakService.isConnected.and.returnValue(false);
            let wrapper = mount(
                <Provider store={store}>
                    <RoomPage params={{data: data}}/>
                </Provider>
            );
            
            expect(cloakService.configureAndRun).toHaveBeenCalledWith(data);
        });
    });

    describe('componentWillUnmount', () => {
        it('if user is connected to the server it calls to be removed from room list', () => {
            data = '1234';
            cloakService.isConnected.and.returnValue(true);
            let wrapper = mount(
                <Provider store={store}>
                    <RoomPage params={{data: data}}/>
                </Provider>
            );
            wrapper.unmount();

            expect(cloakService.messageRemoveFromRoomList).toHaveBeenCalledWith(data);
        });
    });
});
