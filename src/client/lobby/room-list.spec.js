import React from 'react';
import { shallow } from 'enzyme';

import RoomList from './room-list';

let mockList = [{id: 0, name: 'Room 0'}, {id: 1, name: 'Room 1'}];

describe('<RoomList />', () => {

    it('contains "Rooms Available" heading', () => {
        const wrapper = shallow(<RoomList roomList={mockList}/>);
        expect(wrapper.find('h2').text()).toEqual('Rooms Available');
    });

    it('renders the list of open rooms correctly', () => {
        const wrapper = shallow(<RoomList roomList={mockList} />);
        wrapper.find('p').forEach((current, index) => {
            expect(current.text()).toEqual(mockList[index]['name']);
        });
    });

});
