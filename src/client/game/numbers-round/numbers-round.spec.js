import React from 'react';
import { shallow, mount } from 'enzyme';

import { NumbersRound, __RewireAPI__ } from './numbers-round';
import { normaliseRewire } from '../../utils/util';

const { rewire, resetDependency } = normaliseRewire(__RewireAPI__);

describe('<NumbersRound />', () => {
    let props;
    let cloakService;
    let storageService;
    beforeEach(() => {
        props = {
            randomNumber: '',
            leader: {},
            numberList: [],
            disableLarge: false,
            disableSmall: false
        };

        cloakService = jasmine.createSpyObj('cloakService', ['messageGetRandomNumber', 'messageGetLarge', 'messageGetSmall']);
        storageService = jasmine.createSpyObj('storageService', ['getUser']);
        rewire('cloakService', cloakService);
        rewire('storageService', storageService);
    });

    afterEach(() => {
        resetDependency('cloakService');
        resetDependency('storageService');
    });

    it('renders a random number', () => {
        storageService.getUser.and.returnValue({id: 69});
        props.randomNumber = 734;

        const wrapper = shallow(
            <NumbersRound {...props} />
        );

        expect(wrapper.find('#random-number').text()).toEqual('734');
    });

    it('renders numbers as they are sent from the server', () => {
        storageService.getUser.and.returnValue({id: 69});
        props.numberList.push(1);
        props.numberList.push(6969696969696969);

        const wrapper = shallow(
            <NumbersRound {...props} />
        );

        expect(wrapper.find('#number-list').text()).toEqual('16969696969696969');
    });

    it('displays number selection buttons if the user is the leader', () => {

        rewire('storageService', storageService);

        storageService.getUser.and.returnValue({id: 69});
        props.leader.id = 69;

        const wrapper = shallow(
            <NumbersRound {...props} />
        );

        expect(wrapper.find('button').length).toEqual(2);

        resetDependency('storageService');
    });

    it('clicking the "large" button calls messageGetLarge', () => {
        storageService.getUser.and.returnValue({id: 69});
        props.leader.id = 69;

        const wrapper = shallow(
            <NumbersRound {...props} />
        );

        wrapper.find('#get-large').simulate('click');

        expect(cloakService.messageGetLarge).toHaveBeenCalled();
    });

    it('clicking the "small" button calls messageGetSmall', () => {
        storageService.getUser.and.returnValue({id: 69});
        props.leader.id = 69;

        const wrapper = shallow(
            <NumbersRound {...props} />
        );

        wrapper.find('#get-small').simulate('click');

        expect(cloakService.messageGetSmall).toHaveBeenCalled();
    });
});
