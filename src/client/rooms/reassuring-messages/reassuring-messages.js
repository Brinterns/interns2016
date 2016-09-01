import React, { Component } from 'react';
import { connect } from 'react-redux';

import getReassurance from './reassurances';

import style from './reassurances.scss';

let messageInterval;

export default class ReassuringMessages extends Component {
    componentWillMount() {
        this.setState({
            reassurance: 'Welcome to the room!'
        });
        this.messageInterval();
    }

    componentWillUnmount() {
        clearInterval(messageInterval);
    }

    messageInterval() {
        messageInterval = setInterval(this.newReassurance.bind(this), 10000);
    }

    newReassurance() {
        this.setState({
            reassurance: getReassurance()
        });
    }

    render() {
        return (
            <div className={`container-fluid col-lg-6 ${style.reassurances}`}>
                {this.state.reassurance}
            </div>
        );
    };
}

