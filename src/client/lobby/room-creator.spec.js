import React from 'react';
import { shallow, mount } from 'enzyme';

import RoomCreator from './room-creator';

describe('<RoomCreator />', () => {
    let wrapper;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['message']);
        wrapper = shallow(<RoomCreator />);
    });

    it('contains "Create Room & Set Username" heading', () => {
        expect(wrapper.find('h2').text()).toEqual('Create Room & Set Username');
    });

    it('renders "Set Username" button', () => {
        expect(wrapper.find('#user-name-button').text()).toEqual('Set Username');
    });

    it('renders "Create Room" button', () => {
        expect(wrapper.find('#room-name-button').text()).toEqual('Create Room');
    });

    it('changes the state when handleChange is called', () => {
        wrapper = mount(<RoomCreator />);
        let component = wrapper.instance();

        component.handleChange({
            target: {value: 'testingUser'}
        }, 'username');

        expect(wrapper.state()).toEqual({username: 'testingUser'});
    });

    it('sends the setUsername message when the set username button listener is called', () => {
        wrapper = mount(<RoomCreator />);
        let component = wrapper.instance();

        component.handleChange({
            target:{value: 'testingUser'}
        }, 'username')
        component.setUsername();

        expect(cloak.message).toHaveBeenCalledWith('setUsername', 'testingUser');
    });

    it('stores the new username in local storage when setUsername is called', () => {
        wrapper = mount(<RoomCreator />);
        let component = wrapper.instance();

        component.handleChange({
            target:{value: 'testingUser'}
        }, 'username')
        component.setUsername();

        expect(localStorage.name).toEqual('testingUser');
    });

    it('sends the createRoom message when the create room button listener is called', () => {
        wrapper = mount(<RoomCreator />);
        let component = wrapper.instance();

        component.handleChange({
            target:{value: 'testRoom'}
        }, 'roomname')
        component.createRoom();

        expect(cloak.message).toHaveBeenCalledWith('createRoom', 'testRoom');
    });
});
