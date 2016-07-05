import React from 'react';
import { shallow } from 'enzyme';

import RoomList from './room-list';

describe('<RoomList />', () => {
    it('contains "Rooms Available" heading', () => {
        const wrapper = shallow(<RoomList />);
        expect(wrapper.find('h2').text()).toEqual('Rooms Available');
    });
});
