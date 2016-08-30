import React from 'react';
import { shallow } from 'enzyme';

import { DictionaryCorner } from './dictionary-corner';

describe('<DictionaryCorner />', () => {
    let props;
    let bestAnswer;
    beforeEach(() => {
        props = {};
        bestAnswer = {
            word: 'Flange',
            definition: 'Something quite flange-y'
        };
    });

    it('Initialises state correctly', () => {
        let wrapper = shallow(
            <DictionaryCorner {...props} />
        );

        expect(wrapper.state('bestAnswer')).toEqual({});
    });

    describe('Renders components', () => {
        it('Renders Dictionary Corner heading', () => {
            let wrapper = shallow(
                <DictionaryCorner {...props} />
            );

            wrapper.setState({ bestAnswer: bestAnswer });

            expect(wrapper.find('h2').text()).toEqual('Dictionary Corner');
        });

        it('Renders Dictionary Corner image', () => {
            let wrapper = shallow(
                <DictionaryCorner {...props} />
            );

            wrapper.setState({ bestAnswer: bestAnswer });

            expect(wrapper.find('#yung-suze').length).toEqual(1);
        });

        it('Renders the bestAnswer word property', () => {
            let wrapper = shallow(
                <DictionaryCorner {...props} />
            );

            wrapper.setState({ bestAnswer: bestAnswer });

            expect(wrapper.find('#best-answer-word').text()).toEqual('Flange');
        });

        it('Renders the bestAnswer definition property', () => {
            let wrapper = shallow(
                <DictionaryCorner {...props} />
            );

            wrapper.setState({ bestAnswer: bestAnswer });

            expect(wrapper.find('#best-answer-definition').text()).toEqual('Something quite flange-y');
        });
    });
});
