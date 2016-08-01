import React, { Component } from 'react';
import { connect } from 'react-redux';
import { timerTick, resetTimer } from './game-actions';

const SPACE_KEY = 32;
const ENTER_KEY = 13;
const UP_KEY = 38;
const DOWN_KEY = 40;

export class AnswerInput extends Component {
    componentWillMount() {
        this.setState({
            answerList: [''],
            focusIndex: 0
        });
    }

    componentWillUnmount() {
        clearInterval(this.answerInputInterval);
        clearInterval(this.submitInputInterval);
    }

    componentDidUpdate() {
        this.refs[this.state.focusIndex].focus();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.answering === nextProps.answering) {
            return;
        }

        if(nextProps.answering) {
            this.startAnsweringTimer();
        } 

        // if(nextProps.submission) {
        //     this.startSubmitTimer();
        // }
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
                        <input maxLength="18" size="30" placeholder="Enter your answer here" ref={index} onFocus={() => this.handleFocus(index)}
                            defaultValue={answer} onChange={(event) => this.handleChange(event, index)} onKeyDown={event => this.handleKeyPress(event)}
                            disabled={!this.props.answering} />
                        <input type="radio" name="answer" />
                    </div>
                );
            })
        );
    }

    answeringTimerTick() {
        if(this.props.timerValue > 0){
            this.props.timerTick();
        } else {
            clearInterval(this.answerInputInterval);
            this.props.resetTimer();
            this.startSubmitTimer();
        }
    }

    submissionTimerTick() {
        if(this.props.timerValue > 0){
            this.props.timerTick();
        } else {
            clearInterval(this.submitInputInterval);
            this.props.resetTimer();
        }
    }

    startAnsweringTimer() {
        this.answerInputInterval = setInterval(() => this.answeringTimerTick(), 1000);
    }

    startSubmitTimer() {
        this.submitInputInterval = setInterval(() => this.submissionTimerTick(), 1000);
    }

    render() {
        const answerTimerArea = (
            <div>
                <p>Answering Time Left: {this.props.timerValue}</p>
            </div>
        );

        const submitTimerArea = (
            <div>
                <p>Submission Time Left: {this.props.timerValue + 1}</p>
            </div>
        );

        const submitButton = (
            <div>
                <button className="btn btn-success">{this.props.submission.toString()}</button>
            </div>
        );

        return (
            <div className="col-lg-12 text-center">
                <h3>ANSWER INPUT</h3>
                {this.props.answering ? answerTimerArea : null}
                {this.props.submission ? submitTimerArea : null}
                <div>{this.textBoxes()}</div>
                {submitButton}
            </div>
        );
    }
};

const mapStateToProps = state => ({
    timerValue: state.game.timerValue
});

const mapDispatchToProps = dispatch => ({
    timerTick() {
        dispatch(timerTick());
    },
    resetTimer() {
        dispatch(resetTimer());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AnswerInput);