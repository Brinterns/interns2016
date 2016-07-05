import React from 'react';
import { shallow } from 'enzyme';

import Lobby from './lobby';

describe('<Lobby />', () => {
    it('contains "Lobby" heading', () => {
        const wrapper = shallow(<Lobby />);
        expect(wrapper.find('h1').text()).toEqual('Lobby');
    });
});
