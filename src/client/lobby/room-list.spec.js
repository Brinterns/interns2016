import React from 'react';
import { shallow } from 'enzyme';

import RoomList from './room-list';

describe('<RoomList />', () => {
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
    });

    it('contains "Rooms Available" heading', () => {
        const wrapper = shallow(<RoomList />);
        expect(wrapper.find('h1').text()).toEqual('Rooms Available');
    });
});
