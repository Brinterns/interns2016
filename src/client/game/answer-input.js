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
            answerInputTimer: undefined,
            timerValue: undefined
        });
    }

    componentDidUpdate() {
        let focusIndex = this.state.focusIndex;
        this.refs[focusIndex].focus();
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
        console.log(this.state);
        if(this.state.timerValue > 0){
            this.setState({
                timerValue: this.state.timerValue - 1
            });
        }
        else {
            clearTimeout(this.state.answerInputTimer);
            this.setState({
                answerInputTimer: undefined,
                timerValue: undefined
            });
        }
    }

    startTimer() {
        let timer = setInterval(this.timerTick.bind(this), 1000);
        this.setState({
            answerInputTimer: timer,
            timerValue: 30
        })
    }

    render() {
        const timerArea = (
            <div>
                <p>Answering Time Left: {this.state.timerValue}</p>
            </div>
        )
        if(this.props.answering && this.state.answerInputTimer === undefined) {
            this.startTimer();
        }
        return (
            <div className="col-lg-12 text-center">
                <h3>ANSWER INPUT</h3>
                {this.props.answering ? timerArea : null}        
                <div>{this.textBoxes()}</div>
            </div>
        );
    }
};
