import React from 'react';
import { shallow } from 'enzyme';

import { Lobby } from './lobby';

describe('<Lobby />', () => {
	let wrapper;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'connected', 'message']);
        wrapper = shallow(<Lobby />);
    });

    it('contains "Lobby" heading', () => {
        expect(wrapper.find('h1').text()).toEqual('LobbyUsername: ');
    });

    it('sends the setUsername message when the set username button listener is called', () => {
        let component = wrapper.instance();

        component.handleChange({
            target:{value: 'testingUser'}
        }, 'username')

        expect(cloak.message).toHaveBeenCalledWith('setUsername', 'testingUser');
    });

    it('stores the new username in local storage when setUsername is called', () => {
        let component = wrapper.instance();

        component.handleChange({
            target:{value: 'testingUser'}
        }, 'username')

        expect(localStorage.name).toEqual('testingUser');
    });
});
