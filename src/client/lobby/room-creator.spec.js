import React from 'react';
import { shallow } from 'enzyme';

import RoomCreator from './room-creator';

const ENTER_KEY = 13;

describe('<RoomCreator />', () => {
    let wrapper;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['message']);
        wrapper = shallow(<RoomCreator />);
    });

    it('contains "Controls', () => {
        expect(wrapper.find('h2').text()).toEqual('Controls');
    });

    it('renders "Create', () => {
        expect(wrapper.find('#room-name-button').text()).toEqual('Create');
    });

    it('changes the state when handleRoomname is called', () => {
        let component = wrapper.instance();

        component.handleRoomname({
            target: {value: 'testingRoom'}
        });

        expect(wrapper.state()).toEqual({roomname: 'testingRoom'});
    });

    it('sends the createRoom message when the create room button listener is called', () => {
        let component = wrapper.instance();

        component.handleRoomname({
            target:{value: 'testingRoom'}
        });
        component.createRoom();

        expect(cloak.message).toHaveBeenCalledWith('createRoom', 'testingRoom');
    });

    it('sends the createRoom message when the key pressed is enter', () => {
        let component = wrapper.instance();

        component.handleRoomname({
            target:{value: 'testingRoom'}
        });
        component.handleEnterPress({
            which: ENTER_KEY
        });

        expect(cloak.message).toHaveBeenCalledWith('createRoom', 'testingRoom');
    });

    it('does not send the createRoom message when the key pressed is not enter', () => {
        let component = wrapper.instance();

        component.handleRoomname({
            target:{value: 'testingRoom'}
        });
        component.handleEnterPress({
            which: 0
        });

        expect(cloak.message).not.toHaveBeenCalledWith();
    });
});
