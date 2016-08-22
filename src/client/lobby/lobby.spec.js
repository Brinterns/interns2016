import React from 'react';
import { shallow, mount } from 'enzyme';

import { normaliseRewire } from '../utils/util';

import { Lobby, __RewireAPI__ } from './lobby';
const { rewire, resetDependency } = normaliseRewire(__RewireAPI__);

describe('<Lobby />', () => {
    let wrapper;
    let cloakService;
    let storageService;
    beforeEach(() => {
        cloakService = jasmine.createSpyObj('cloakService', ['configureAndRun', 'isConnected', 'resetScore', 'messageSetUsername']);
        storageService = jasmine.createSpyObj('storageService', ['storeName', 'getUser']);
        storageService.getUser.and.callFake(() => {
            return {
                name: 'fakeUser'
            }
        })
        rewire('cloakService', cloakService);
        rewire('storageService', storageService);
        wrapper = shallow(<Lobby />);
    });

    afterEach(() => {
        resetDependency('cloakService');
        resetDependency('storageService');
    })

    it('contains "Lobby" heading', () => {
        expect(wrapper.find('h1').text()).toEqual('LobbyUsername:');
    });

    it('calls configureAndRun if not connected', () => {
        cloakService.isConnected.and.callFake(() => false);
        wrapper = shallow(<Lobby />);

        expect(cloakService.configureAndRun).toHaveBeenCalled();
    })

    it('calls resetScore if connected', () => {
        cloakService.isConnected.and.callFake(() => true);
        wrapper = shallow(<Lobby />);

        expect(cloakService.resetScore).toHaveBeenCalled();
    })

    it('sends the setUsername message when the set username button listener is called', () => {
        let component = wrapper.instance();

        component.handleChange({
            target:{value: 'testingUser'}
        }, 'username')

        expect(cloakService.messageSetUsername).toHaveBeenCalledWith('testingUser');
    });

    it('stores the new username in local storage when setUsername is called', () => {
        let component = wrapper.instance();

        component.handleChange({
            target:{value: 'testingUser'}
        }, 'username')

        expect(storageService.storeName).toHaveBeenCalledWith('testingUser');
    });
});
