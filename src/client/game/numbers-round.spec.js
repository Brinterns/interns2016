import React from 'react'; 
import { shallow, mount } from 'enzyme';

import { NumbersRound, __RewireAPI__ } from './numbers-round';

const rewire = __RewireAPI__.__Rewire__;
const resetDependency = __RewireAPI__.__ResetDependency__;

describe('<NumbersRound />', () => {
    let props;
    let cloakService
    beforeEach(() => {
        props = {
            randomNumber: '',
            leader: {},
            numberList: [],
            disableLarge: false,
            disableSmall: false
        };
        
        cloakService = jasmine.createSpyObj('cloakService', ['messageGetRandomNumber', 'messageGetLarge', 'messageGetSmall']);
        rewire('cloakService', cloakService);
    });

    afterEach(() => {
        resetDependency('cloakService');
    });

    it('calls messageGetRandomNumber on mount', () => {
        const wrapper = shallow(
            <NumbersRound {...props} />
        )

        expect(cloakService.messageGetRandomNumber).toHaveBeenCalled();
    });

    it('renders a random number', () => {
        props.randomNumber = 734;

        const wrapper = shallow(
            <NumbersRound {...props} />
        );

        expect(wrapper.find('#random-number').text()).toEqual('734');
    });

    it('renders numbers as they are sent from the server', () => {
        props.numberList.push(1);
        props.numberList.push(6969696969696969);

        const wrapper = shallow(
            <NumbersRound {...props} />
        );

        expect(wrapper.find('#number-list').text()).toEqual('16969696969696969');
    });

    it('displays number selection buttons if the user is the leader', () => {
        let storageService = jasmine.createSpyObj('storageService', ['getUser']);
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
        let storageService = jasmine.createSpyObj('storageService', ['getUser']);
        rewire('storageService', storageService);

        storageService.getUser.and.returnValue({id: 69});
        props.leader.id = 69;

        const wrapper = shallow(
            <NumbersRound {...props} />
        );

        wrapper.find('#get-large').simulate('click');
        
        expect(cloakService.messageGetLarge).toHaveBeenCalled();
        
        resetDependency('storageService');
    });

    it('clicking the "small" button calls messageGetSmall', () => {
        let storageService = jasmine.createSpyObj('storageService', ['getUser']);
        rewire('storageService', storageService);

        storageService.getUser.and.returnValue({id: 69});
        props.leader.id = 69;

        const wrapper = shallow(
            <NumbersRound {...props} />
        );

        wrapper.find('#get-small').simulate('click');
        
        expect(cloakService.messageGetSmall).toHaveBeenCalled();
        
        resetDependency('storageService');
    });
});