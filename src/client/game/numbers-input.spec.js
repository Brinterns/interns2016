import React from 'react';
import { shallow, mount } from 'enzyme';

import { NumbersInput, __RewireAPI__ } from './numbers-input';
import { handleTab, normaliseRewire } from '../utils/util';

const { rewire, resetDependency } = normaliseRewire(__RewireAPI__);

describe('<NumbersInput />', () => {
    let props;
    beforeEach(() => {
        props = {};
    })

    it('Renders "Answer" h3', () => {
        let wrapper = shallow(
            <NumbersInput {...props} />
        );

        expect(wrapper.find('h3').text()).toEqual('Answer');
    });
});
