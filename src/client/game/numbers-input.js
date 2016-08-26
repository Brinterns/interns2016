import React, { Component } from 'react';

import { handleTab } from '../utils/util';

const TAB = 9;

export default class NumbersInput extends Component {
    handleKeyPress(event) {
        switch (event.which) {
            case TAB: {
                event.preventDefault();
                handleTab(event);
                break;
            }
            default: {}
        };
    }

    render() {
        return (
            <div className="col-lg-12 text-center">
                <h3>Answer</h3>
                <div>
                    <textarea rows="20" cols="100" size="1000" placeholder="Answer here"
                    onKeyDown={event => this.handleKeyPress(event)} />
                </div>
            </div>
        );
    }
}
