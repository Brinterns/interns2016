import React from 'react'; 
import { shallow, mount } from 'enzyme';

import { NumbersRound, __RewireAPI__ } from './numbers-round';

const rewire = __RewireAPI__.__Rewire__;
const resetDependency = __RewireAPI__.__ResetDependency__;

describe('<NumbersRound />', () => {
    let props;
    beforeEach(() => {
        props = {
            randomNumber: '',
            leader: {}
        };
    });

    it('calls messageGetRandomNumber on mount', () => {
        let cloakService = jasmine.createSpyObj('cloakService', ['messageGetRandomNumber']);
        rewire('cloakService', cloakService);
        props.leader.id = 1;

        const wrapper = shallow(
            <NumbersRound {...props} />
        )

        expect(cloakService.messageGetRandomNumber).toHaveBeenCalled();
        
        resetDependency('cloakService');
    });

    it('renders a random number', () => {
        let cloakService = jasmine.createSpyObj('cloakService', ['messageGetRandomNumber']);
        rewire('cloakService', cloakService);
        props.randomNumber = 734;

        const wrapper = shallow(
            <NumbersRound {...props} />
        );

        expect(wrapper.find('#random-number').text()).toEqual('734');
        resetDependency('cloakService');
    });
});