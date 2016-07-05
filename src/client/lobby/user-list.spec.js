import React from 'react';
import { shallow } from 'enzyme';

import UserList from './user-list';

describe('<UserList />', () => {
    it('contains "User List" heading', () => {
        const wrapper = shallow(<UserList />);
        expect(wrapper.find('h2').text()).toEqual('User List');
    });
});
