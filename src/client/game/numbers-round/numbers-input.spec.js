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
    });

    it('Renders "Answer" h3', () => {
        let wrapper = shallow(
            <NumbersInput {...props} />
        );

        expect(wrapper.find('h3').text()).toEqual('Answer');
    });

    it('sets sets state correctly when an answer gets typed in the answer text area', () => {
        let wrapper = shallow(
            <NumbersInput {...props} />
        );

        wrapper.find('textarea').simulate('change', {
            target: {
                value: 'answer 1'
            }
        });

        expect(wrapper.state().answer).toEqual('answer 1');
    });

    describe('tab key press', () => {
        let handleTab;
        let preventDefault;

        beforeEach(() => {
            handleTab = jasmine.createSpy('handleTab');
            preventDefault = jasmine.createSpy('preventDefault');
            rewire('handleTab', handleTab);
        });

        afterEach(() => {
            resetDependency('handleTab');
        });

        it('calls "preventDefault" if a tab is pressed in the answer text area', () => {
            let wrapper = shallow(
                <NumbersInput {...props} />
            );
            let event = {
                which: 9,
                target: {
                    value: 'answer 1'
                },
                preventDefault: preventDefault
            }

            wrapper.find('textarea').simulate('keydown', event);

            expect(preventDefault).toHaveBeenCalled();
        });

        it('calls the "handleTab" function if a tab is pressed in the answer text area', () => {
            let wrapper = shallow(
                <NumbersInput {...props} />
            );
            let event = {
                which: 9,
                target: {
                    value: 'answer 1'
                },
                preventDefault: preventDefault
            }

            wrapper.find('textarea').simulate('keydown', event);

            expect(handleTab).toHaveBeenCalledWith(event);
        });
    });

    it('calls cloakService.messageSendEquation when the sendEquation prop changes to true', () => {
        let cloakService = jasmine.createSpyObj('cloakService', ['messageSendEquation']);
        rewire('cloakService', cloakService);

        let wrapper = shallow(
            <NumbersInput {...props} />
        );
        wrapper.setState({
            answer: 'answer 1'
        });
        wrapper.setProps({
            sendEquation: true
        });

        expect(cloakService.messageSendEquation).toHaveBeenCalledWith('answer 1');
        resetDependency('cloakService');
    });

    it('resets the answer to empty when the resetRound prop changes to true', () => {
        let wrapper = shallow(
            <NumbersInput {...props} />
        );
        wrapper.setState({
            answer: 'answer 1'
        });
        wrapper.setProps({
            resetRound: true
        });

        expect(wrapper.state().answer).toEqual('');
    });
});
