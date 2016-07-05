import React from 'react';
import { shallow } from 'enzyme';

import RoomCreator from './room-creator';

describe('<RoomCreator />', () => {
    it('contains "Create Room & Set Username" heading', () => {
        const wrapper = shallow(<RoomCreator />);
        expect(wrapper.find('h2').text()).toEqual('Create Room & Set Username');
    });

    it('renders "Set Username" button', () => {
        const wrapper = shallow(<RoomCreator />);
        expect(wrapper.find('#user-name-button').text()).toEqual('Set Username');
    });

    it('renders "Create Room" button', () => {
        const wrapper = shallow(<RoomCreator />);
        expect(wrapper.find('#room-name-button').text()).toEqual('Create Room');
    });
});
