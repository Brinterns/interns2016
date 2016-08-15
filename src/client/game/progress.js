import React, { Component } from 'react';
import { connect } from 'react-redux';

import style from '../rooms/room.scss'

export class Progress extends Component {
    timer(timeLeft, maxTime) {
        let barStyle = {
            width: `${timeLeft===undefined ? 0 : 100-((100*timeLeft)/maxTime)}%`,
            transition: {
                duration: '1000ms'
            }
        };
        return (
            <div className={`progress`}>
                <div className="progress-bar progress-bar-danger progress-bar-striped active"
                    role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={barStyle}>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className={style['timers']}>
                <div>{this.props.answering ? this.timer(this.props.answerTimerValue, this.props.gameParams.answerTime) : null}</div>
                <div>{this.props.submission ? this.timer(this.props.submissionTimerValue, this.props.gameParams.submitTime) : null}</div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    answering: state.game.answering,
    submission: state.game.submission,
    answerTimerValue: state.game.answerTimerValue,
    submissionTimerValue: state.game.submissionTimerValue,
    gameParams: state.game.gameParams
});

export default connect(
    mapStateToProps
)(Progress);
