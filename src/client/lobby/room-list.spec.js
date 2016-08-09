import React from 'react';
import { shallow, mount } from 'enzyme';

import RoomList from './room-list';

describe('<RoomList />', () => {
    let mockList;
    beforeEach(() => {
        mockList = [
            {id: 0, name: 'Room 0', users: ['a','b'], data: { started: false }},
            {id: 1, name: 'Room 1', users: [], data: { started: false }}
        ];

    });

    it('contains "Rooms Available" heading', () => {
        const wrapper = shallow(<RoomList roomList={mockList}/>);
        
        expect(wrapper.find('h2').text()).toEqual('Rooms Available');
    });

    it('renders the rooms in which a game has not started', () => {
        const wrapper = shallow(<RoomList roomList={mockList} />);

        wrapper.find('button').forEach((current, index) => {
            expect(current.text()).toEqual(`${mockList[index].name}${mockList[index].users.length}`);
        });
    });

    it('renders the number of users in a room if it is not undefined', () => {
        const wrapper = shallow(<RoomList roomList={[mockList[0]]} />);

        wrapper.find('badge').forEach((span, index) => {
            expect(span.text()).toEqual('2');
        });
    });

    it('room has the class warning list-group-item-warning if the game has not started', () => {
        const wrapper = mount(<RoomList roomList={[mockList[0]]} />);

        wrapper.find('button').forEach((span, index) => {
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

        const wrapper = mount(<RoomList roomList={mockList} />);

        expect(wrapper.find('button').length).toEqual(4);
    });

});
