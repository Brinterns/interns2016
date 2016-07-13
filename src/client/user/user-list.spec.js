import React from 'react';
import { shallow } from 'enzyme';

import UserList from './user-list';

let mockList = [{id: 0, name: 'Jamie'}, {id: 1, name: 'Raul'}];

describe('<UserList />', () => {
    it('contains "User List" heading', () => {
        const wrapper = shallow(<UserList users={mockList} />);
        expect(wrapper.find('h2').text()).toEqual('User List');
    });

    it('renders the list of users in lobby correctly', () => {
        const wrapper = shallow(<UserList users={mockList} />);
        wrapper.find('li').forEach((current, index) => {
            expect(current.text()).toEqual(mockList[index].name);
        });
    });
});
