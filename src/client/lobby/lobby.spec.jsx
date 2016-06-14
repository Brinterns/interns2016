import React from 'react';
import { shallow } from 'enzyme';

import Lobby from './lobby';

describe('<Lobby />', () => {
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
    });

    it('contains "Lobby" heading', () => {
        const wrapper = shallow(<Lobby />);

        expect(wrapper.find('h1').text()).toEqual('Lobby');
    });
});