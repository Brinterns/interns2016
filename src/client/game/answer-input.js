import React, { Component } from 'react';
import { connect } from 'react-redux';
import Progress from './progress';

import { answerTimerTick, submissionTimerTick, resetAnswerTimer, resetSubmissionTimer } from './letter-round-actions';

import cloakService from '../services/cloak-service';

import style from './game.scss';

const SPACE_KEY = 32;
const ENTER_KEY = 13;
const UP_KEY = 38;
const DOWN_KEY = 40;

export class AnswerInput extends Component {
    componentWillMount() {
        this.setState({
            answerList: [''],
            focusIndex: 0,
            answerToSubmit: 0
        });
    }

    componentDidMount() {
        this.refs[`radio${this.state.answerToSubmit}`].checked = true;
        this.refs[this.state.answerToSubmit].className = style.answerBoxesChecked;
    }

    componentWillUnmount() {
        clearInterval(this.answerInputInterval);
        clearInterval(this.submitInputInterval);
    }

    componentDidUpdate() {
        this.refs[this.state.focusIndex].focus();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.answering === nextProps.answering && this.props.submission === nextProps.submission) {
            return;
        }

        if(nextProps.answering) {
            this.startAnsweringTimer();
            return;
        }

        if(nextProps.submission) {
            cloakService.messageAnswers(this.state.answerList);
            this.startSubmitTimer();
            return;
        }
    }

    handleKeyPress(event) {
        switch (event.which) {
            case ENTER_KEY: {
                if(event.target.value === "") {
                    return;
                }

                const { answerList } = this.state;
                for(let i = 0; i < answerList.length; i++) {
                    if(answerList[i] === '') {
                        this.setState({
                            focusIndex: i
                        });
                        return;
                    }
                }

                this.setState({
                    answerList: [...answerList, ''],
                    focusIndex: answerList.length
                });

                break;
            }
            case UP_KEY: {
                const { focusIndex } = this.state;
                if(focusIndex === 0) {
                    return;
                }

                this.setState({
                    focusIndex: focusIndex - 1
                });

                break;
            }
            case DOWN_KEY: {
                const { focusIndex } = this.state;
                if(focusIndex === this.state.answerList.length-1) {
                    return;
                }

                this.setState({
                    focusIndex: focusIndex + 1
                });

                break;
            }
            case SPACE_KEY: {
                event.preventDefault();
                const { focusIndex, answerList } = this.state;

                this.refs[`radio${focusIndex}`].checked = true;

                for(let i=0; i<answerList.length; i++) {
                    this.refs[i].className = '';
                }

                this.refs[focusIndex].className = style.answerBoxesChecked;

                this.setAnswer();

                break;
            }
        }
    }

    handleChange(event, id) {
        this.setState({
            answerList: this.state.answerList
                .map((originalAnswer, index) => {
                    if(index === id) {
                        return event.target.value;
                    }
                    return originalAnswer;
                })
        });
    }

    handleFocus(index) {
        this.setState({
            focusIndex: index
        });
    }

    textBoxes() {
        const { answerList, focusIndex } = this.state;
        return (
            answerList.map((answer,index) => {
                let focus = index === focusIndex;
                return (
                    <div className="row radio radio-info">
                        <input maxLength="18" size="30" placeholder="Answer here" ref={index} onFocus={() => this.handleFocus(index)}
                            defaultValue={answer} onChange={(event) => this.handleChange(event, index)} onKeyDown={event => this.handleKeyPress(event)}
                            disabled={!this.props.answering} />
                        <input type="radio" name="answer" ref={`radio${index}`} onClick={() => this.setAnswer()}/>
                    </div>
                );
            })
        );
    }

    answeringTimerTick() {
        if(this.props.answerTimerValue > 0){
            this.props.answerTimerTick();
        } else {
            clearInterval(this.answerInputInterval);
            this.props.resetAnswerTimer();
        }
    }

    submissionTimerTick() {
        if(this.props.submissionTimerValue > 0){
            this.props.submissionTimerTick();
        } else {
            this.submitAnswer();
            clearInterval(this.submitInputInterval);
            this.props.resetSubmissionTimer();
        }
    }

    startAnsweringTimer() {
        this.answerInputInterval = setInterval(() => this.answeringTimerTick(), 1000);
    }

    startSubmitTimer() {
        this.submitInputInterval = setInterval(() => this.submissionTimerTick(), 1000);
    }

    setAnswer() {
        const { answerList } = this.state;
        for(let i=0; i<answerList.length; i++) {
            if(this.refs[`radio${i}`].checked === true) {
                this.setState({
                    answerToSubmit: i
                });
            }
        }
    }

    submitAnswer() {
        cloakService.messageAnswerToSubmit(this.state.answerToSubmit);
    }

    render() {
        const submitButton = (
            <div>
                <button className="btn btn-success" onClick={() => this.submitAnswer()}>Ready</button>
            </div>
        );

        return (
            <div className="col-lg-12 text-center">
                <h3>Answer</h3>
                <div>{this.textBoxes()}</div>
                {this.props.submission ? submitButton : null}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    answerTimerValue: state.game.answerTimerValue,
    submissionTimerValue: state.game.submissionTimerValue
});

const mapDispatchToProps = dispatch => ({
    answerTimerTick() {
        dispatch(answerTimerTick());
    },
    submissionTimerTick() {
        dispatch(submissionTimerTick());
    },
    resetAnswerTimer() {
        dispatch(resetAnswerTimer());
    },
    resetSubmissionTimer() {
        dispatch(resetSubmissionTimer());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AnswerInput);
