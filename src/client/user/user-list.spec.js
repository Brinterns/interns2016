import React from 'react';
import { shallow, mount } from 'enzyme';

import UserList from './user-list';

describe('<UserList />', () => {
    let mockList;
    let wrapper;
    beforeEach(() => {
        mockList = [
            { id: 0, name: 'Jamie', data: {} },
            { id: 1, name: 'Raul', data: {} }
        ];
        wrapper = shallow(<UserList users={mockList} />);
    });

    it('contains "Users" heading', () => {
        expect(wrapper.find('h2').text()).toEqual('Users');
    });

    it('renders the list of users in lobby correctly', () => {
        wrapper.find('li').forEach((current, index) => {
            expect(current.text()).toEqual(mockList[index].name);
        });
    });

    it('renders a score if applicable', () => {
        mockList[0].data.score = 1;

        wrapper = mount(<UserList users={[mockList[0]]} />);

        wrapper.find('.badge').forEach((span, index) => {
            expect(span.text()).toEqual('1');
        });      
    })

    it('sorts by score if applicable', () => {
        mockList[0].data.score = 41;
        mockList[1].data.score = 15;
        mockList.push({ id: 2, name: 'Jamie', data: { score: 32 } });
        mockList.push({ id: 3, name: 'Jamie', data: { score: 24 } });
        mockList.push({ id: 4, name: 'Jamie', data: { score: 15 } });

        wrapper = mount(<UserList users={mockList} />);

        let prev;
        wrapper.find('.badge').forEach((span, index) => {
            let thisNum = parseInt(span.text(), 10);
            if (prev === undefined) {
                prev = thisNum;
                return;
            } 

            expect(thisNum <= prev).toBe(true);
            prev = thisNum;
        });      
    });

    it('sorts alphabetically if scores are equal', () => {
        mockList[0].data.score = 0;
        mockList[1].data.score = 0;
        mockList.push({ id: 2, name: 'User1', data: { score: 0 } });
        mockList.push({ id: 3, name: 'User2', data: { score: 0 } });
        mockList.push({ id: 4, name: 'AAA', data: { score: 0 } });
        
        wrapper = mount(<UserList users={mockList} />);

        let prev;
        wrapper.find('li').forEach((current, index) => {
            let thisUser = current.text();
            if (prev === undefined) {
                prev = thisUser;
                return;
            } 

            expect(prev <= thisUser).toBe(true);
            prev = thisUser;
        });      
    });
});
