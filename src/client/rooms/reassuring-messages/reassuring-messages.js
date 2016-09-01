import React, { Component } from 'react';
import { connect } from 'react-redux';

import getReassurance from './reassurances';

import style from './reassurances.scss';

let messageInterval;

export default class ReassuringMessages extends Component {
    componentWillMount() {
        this.setState({
            reassurance: { message: 'Welcome to the room!', person: 'DON\'T WORRY ITS JUST COUNTDOWN'}
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
            <div className={`list-group-item container-fluid col-lg-6 ${style['reassurances-wrapper']}`}>
                <div className={style['reassurances-message']}>
                    "{this.state.reassurance.message}"
                </div>
                <div className={style['reassurances-person']}>
                    - {this.state.reassurance.person}
                </div>
            </div>
        );
    };
}

