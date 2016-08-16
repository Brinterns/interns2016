import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';

import store from '../store';

import { RoomList } from './room-list';

describe('<RoomList />', () => {
    let props;
    let mockList;
    beforeEach(() => {
        props = {
            roomList: [],
            rounds: {}
        };
    });

    it('contains "Rooms" heading', () => {
        const wrapper = shallow(
                <RoomList {...props} />
        );

        expect(wrapper.find('h2').text()).toEqual('Rooms');
    });

    it('renders the rooms in which a game has not started', () => {
        mockList = [
            {id: 0, name: 'Room 0', users: ['a','b'], data: { started: false }},
            {id: 1, name: 'Room 1', users: [], data: { started: false }}
        ];
        props.roomList = mockList;

        const wrapper = shallow(
                <RoomList {...props} />
        );

        wrapper.find('.list-group-item').forEach((current, index) => {
            expect(current.text()).toEqual(`${mockList[index].name}${mockList[index].users.length}`);
        });
    });

    it('renders the number of users in a room if it is not undefined', () => {
        const wrapper = shallow(
                <RoomList {...props} />
        );

        wrapper.find('badge').forEach((span, index) => {
            expect(span.text()).toEqual('2');
        });
    });

    it('room has the class warning list-group-item-warning if the game has not started', () => {
        mockList = [
            {id: 0, name: 'Room 0', users: ['a','b'], data: { started: false }},
            {id: 1, name: 'Room 1', users: [], data: { started: false }}
        ];
        props.roomList = mockList;

        const wrapper = shallow(
                <RoomList {...props} />
        );

        wrapper.find('list-group-item').forEach((span, index) => {
            expect(span.hasClass('list-group-item-warning')).toBe(true);
        });
    });

    it('does not render any rooms in which a game has started', () => {
        mockList.push({id: 3, name: 'Room 3', users: [], data: { started: true }});
        mockList.push({id: 4, name: 'Room 4', users: [], data: { started: false }});
        mockList.push({id: 5, name: 'Room 5', users: [], data: { started: true }});
        mockList.push({id: 6, name: 'Room 6', users: [], data: { started: true }});
        mockList.push({id: 7, name: 'Room 7', users: [], data: { started: true }});
        mockList.push({id: 8, name: 'Room 8', users: [], data: { started: true }});
        mockList.push({id: 9, name: 'Room 9', users: [], data: { started: true }});
        mockList.push({id: 10, name: 'Room 10', users: [], data: { started: false }});

        props.roomList = mockList;

        const wrapper = shallow(
            <RoomList {...props} />
        );

        expect(wrapper.find('.list-group-item').length).toEqual(4);
    });

    // it('start button calls createRoom', () => {
    //     let cloakService = jasmine.createSpyObj('cloakService', ['messageCreateRoom']);
    //     let RoomList = jasmine.createSpyObj('RoomList', ['createRoom']);

    //     const wrapper = shallow(
    //         <RoomList {...props} />
    //     );

    //     RoomList.createRoom;
    //     expect(cloakService.messageCreateRoom).toHaveBeenCalled();
    // });
});
