import React, { Component } from 'react';
import { connect } from 'react-redux';

import cloakService from '../services/cloak-service';

import { handleTab } from '../utils/util';

const TAB = 9;

export class NumbersInput extends Component {
    componentWillMount() {
        this.setState({
            answer: ''
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.sendEquation !== this.props.sendEquation && nextProps.sendEquation){
            cloakService.messageSendEquation(this.state.answer);
        }
    }

    handleKeyPress(event) {
        switch (event.which) {
            case TAB: {
                event.preventDefault();
                handleTab(event);
                this.setState({
                    answer: event.target.value
                });
                break;
            }
            default: {}
        };
    }

    handleChange(event) {
        this.setState({
            answer: event.target.value
        });
    }

    render() {
        return (
            <div className="col-lg-12 text-center">
                <h3>Answer</h3>
                <div>
                    <textarea rows="20" size="1000" placeholder="Answer here"
                    onKeyDown={event => this.handleKeyPress(event)}
                    onChange={event => this.handleChange(event)}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    sendEquation: state.game.sendEquation
});

export default connect(
    mapStateToProps
)(NumbersInput);
