import React from 'react';
import { shallow } from 'enzyme';

import RoomCreator from './room-creator';

describe('<RoomCreator />', () => {
    it('contains "Create Room & Set Username" heading', () => {
        const wrapper = shallow(<RoomCreator />);
        expect(wrapper.find('h2').text()).toEqual('Create Room & Set Username');
    });
    it('renders "Set Username and Create Room" buttons', () => {
        const names = ['Set Username', 'Create Room'];
        const wrapper = shallow(<RoomCreator />);
        wrapper.find('button').forEach((current, index) => {
            expect(current.text()).toEqual(names[index]);
        });
    });
});
