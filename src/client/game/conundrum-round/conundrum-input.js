import React, { Component } from 'react';
import { connect } from 'react-redux';

import { answerTimerTick, resetAnswerTimer } from '../letters-round/letter-round-actions';

import cloakService from '../../services/cloak-service';
import style from '../game.scss';

export class ConundrumInput extends Component {
    componentWillMount() {
        this.setState({
            submitted: false
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.answering !== this.props.answering && nextProps.answering) {
            this.startAnsweringTimer();
        }

        if(nextProps.roundResults !== this.props.roundResults && this.props.roundResults) {
            clearInterval(this.answerInputInterval);
            this.props.resetAnswerTimer();
        }
    }

    componentWillUnmount() {
        clearInterval(this.answerInputInterval);
        this.props.resetAnswerTimer();
    }

    startAnsweringTimer() {
        this.answerInputInterval = setInterval(() => this.answeringTimerTick(), 1000);
    }

    answeringTimerTick() {
        if(this.props.answerTimerValue > 0){
            this.props.answerTimerTick();
        } else {
            clearInterval(this.answerInputInterval);
            this.props.resetAnswerTimer();
        }
    }

    submitAnswer() {
        cloakService.messageSubmitAnagram(this.state.answer);
        this.setState({
            submitted: true
        });
    }

    handleChange(event) {
        this.setState({
            answer: event.target.value
        });
    }

    render() {
        console.log(this.props.answerTimerValue);
        const submitButton = (
            <div>
                <button className={`btn btn-success ${style['submit-button']}`} onClick={() => this.submitAnswer.bind(this)()}>Submit</button>
            </div>
        );

        return (
            <div className="col-lg-12 text-center">
                <h3>Answer</h3>
                <input maxLength="20" size="30" placeholder="Answer here"
                onChange={(event) => this.handleChange(event)} />
                {!this.state.submitted ? submitButton : null}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    answerTimerValue: state.game.answerTimerValue,
    answering: state.game.answering,
    roundResults: state.game.roundResults
});

const mapDispatchToProps = dispatch => ({
    answerTimerTick() {
        dispatch(answerTimerTick());
    },
    resetAnswerTimer() {
        dispatch(resetAnswerTimer());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConundrumInput)