import React, { Component } from 'react';

const SPACE_KEY = 32;
const ENTER_KEY = 13;
const UP_KEY = 38;
const DOWN_KEY = 40;

export default class AnswerInput extends Component {
    componentWillMount() {
        this.setState({
            answerList: [''],
            focusIndex: 0,
            timerValue: null
        });
    }

    componentWillUnmount() {
        clearInterval(this.answerInputInterval);
    }

    componentDidUpdate() {
        this.refs[this.state.focusIndex].focus();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.answering === nextProps.answering) {
            return;
        }

        if(nextProps.answering) {
            this.startTimer();
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

    timerTick() {
        if(this.state.timerValue > 0){
            this.setState({
                timerValue: this.state.timerValue - 1
            });
        } else {
            clearInterval(this.answerInputInterval);
            this.setState({
                timerValue: null
            });
        }
    }


    startTimer() {
        this.answerInputInterval = setInterval(() => this.timerTick(), 1000);
        this.setState({
            timerValue: 30
        })
    }

    render() {
        const timerArea = (
            <div>
                <p>Answering Time Left: {this.state.timerValue}</p>
            </div>
        );

        return (
            <div className="col-lg-12 text-center">
                <h3>ANSWER INPUT</h3>
                {this.props.answering ? timerArea : null}        
                <div>{this.textBoxes()}</div>
            </div>
        );
    }
};
