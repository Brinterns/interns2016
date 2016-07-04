import React from 'react';
import { shallow } from 'enzyme';

import RoomCreator from './room-creator';

describe('<RoomCreator />', () => {
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
    });

    it('contains "Create Room & Set Username" heading', () => {
        const wrapper = shallow(<RoomCreator />);
        expect(wrapper.find('h1').text()).toEqual('Create Room & Set Username');
    });
});
