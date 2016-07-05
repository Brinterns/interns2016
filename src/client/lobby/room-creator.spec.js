import React from 'react';
import { shallow } from 'enzyme';

import RoomCreator from './room-creator';

describe('<RoomCreator />', () => {
    it('contains "Create Room & Set Username" heading', () => {
        const wrapper = shallow(<RoomCreator />);
        expect(wrapper.find('h1').text()).toEqual('Create Room & Set Username');
    });
});
