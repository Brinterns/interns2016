import React from 'react';
import { shallow, mount } from 'enzyme';

import { NumbersInput, __RewireAPI__ } from './numbers-input';
import { handleTab, normaliseRewire } from '../../utils/util';

const { rewire, resetDependency } = normaliseRewire(__RewireAPI__);

describe('<NumbersInput />', () => {
    let props;
    let cloakService;

    beforeEach(() => {
        props = {};
    })

    it('Renders "Answer" h3', () => {
        let wrapper = shallow(
            <NumbersInput {...props} />
        );

        expect(wrapper.find('h3').text()).toEqual('Answer');
    });

    it('Initialises state correctly', () => {
        let wrapper = shallow(
            <NumbersInput {...props} />
        );

        expect(wrapper.state().answer).toEqual('');
    });

    describe('Behaviour on receiving new props', () => {
        it('Calls messageSendEquation when the sendEquation prop is first sent', () => {
            cloakService = jasmine.createSpyObj('cloakService', ['messageSendEquation']);
            rewire('cloakService', cloakService);
            props = {
                sendEquation: false
            };

            let wrapper = shallow(
                <NumbersInput {...props} />
            );

            wrapper.setProps({ sendEquation: true });

            expect(cloakService.messageSendEquation).toHaveBeenCalled();
            
            resetDependency('cloakService');
        });

        it('Resets state.answer when the resetRound prop is first sent', () => {
            props = {
                resetRound: false
            };

            let wrapper = shallow(
                <NumbersInput {...props} />
            );

            wrapper.setProps({ resetRound: true });

            expect(wrapper.state('answer')).toEqual('');
        });
    });
});
