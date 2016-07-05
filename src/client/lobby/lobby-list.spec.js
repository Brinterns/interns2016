import React from 'react';
import { shallow } from 'enzyme';

import LobbyList from './lobby-list';

describe('<LobbyList />', () => {
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
    });

    it('renders the list of users in lobby', () => {
        let testLobbyArr = [{id: 0, name: "Raul"}, {id: 1, name: "Jamie"}];
        const wrapper = shallow(<LobbyList lobbyUsers={testLobbyArr}/>);
        wrapper.find('p').forEach((current, index) => {
            expect(current.text()).toEqual(testLobbyArr[index]["name"]);
        });
    });
});
