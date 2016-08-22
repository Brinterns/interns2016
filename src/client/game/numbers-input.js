import React, { Component } from 'react';

export default class NumbersInput extends Component {
    handleKeyPress(event) {
        switch (event.which) {
            case 9: {
                event.preventDefault();
                event.target.value += '    ';
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
                    <textarea rows="5" size="200" placeholder="Answer here"
                    onKeyDown={event => this.handleKeyPress(event)} />
                </div>
            </div>
        );
    }
}
