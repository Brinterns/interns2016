import React from 'react';
import { shallow, mount } from 'enzyme';

import { RoomList, __RewireAPI__ } from './room-list';
const rewire = __RewireAPI__.__Rewire__;
const resetDependency = __RewireAPI__.__ResetDependency__;

describe('<RoomList />', () => {
    let props;
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
        let mockList = [
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
        props.roomList = [
            {id: 0, name: 'Room 0', users: ['a','b'], data: { started: false }},
            {id: 1, name: 'Room 1', users: [], data: { started: false }}
        ];

        const wrapper = shallow(
                <RoomList {...props} />
        );

        wrapper.find('list-group-item').forEach((span, index) => {
            expect(span.hasClass('list-group-item-warning')).toBe(true);
        });
    });

    it('does not render any rooms in which a game has started', () => {
        props.roomList = [
            {id: 0, name: 'Room 0', users: [], data: { started: false }},
            {id: 1, name: 'Room 1', users: [], data: { started: true  }}
        ];

        const wrapper = shallow(
            <RoomList {...props} />
        );

        expect(wrapper.find('.list-group-item').length).toEqual(1);
    });

    it('start button calls createRoom', () => {
        let cloakService = jasmine.createSpyObj('cloakService', ['messageCreateRoom']);
        let RoomOptions = () => null;
        rewire('cloakService', cloakService);
        rewire('RoomOptions', RoomOptions)
        
        const wrapper = mount(
            <RoomList {...props} />
        );

        wrapper.find('#room-name-button').simulate('click');
        expect(cloakService.messageCreateRoom).toHaveBeenCalled();

        resetDependency('cloakService');
        resetDependency('RoomOptions');
    });
});
