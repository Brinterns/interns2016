import React, { Component } from 'react';

import style from '../index.scss';

const SPACE = 32
  , ENTER_KEY = 13
  , UP_KEY = 38
  , DOWN_KEY = 40;

export default class AnswerInput extends Component {
    componentWillMount() {
        this.setState({
            answerList: [''],
            focusIndex: 0
        });
    }

    handleEnterPress(event) {
        switch (event.which) {
            case ENTER_KEY: { //Enter key press
                if(event.target.value.length > 0) {
                    let answerList = this.state.answerList;
                    for(let i = 0; i < answerList.length; i++) {
                        console.log(answerList[i])
                        if(answerList[i] === '') {
                            this.setState({
                                answerList: [...this.state.answerList],
                                focusIndex: i
                            });
                            return;
                        }
                    }    
                    this.setState({
                        answerList: [...this.state.answerList, ''],
                        focusIndex: this.state.answerList.length
                    });
                }
                break;
            }
            case UP_KEY: {
                let focusIndex = this.state.focusIndex === 0 ? 0 : this.state.focusIndex-1;
                this.setState({
                    focusIndex: focusIndex
                });
                break;
            }
            case DOWN_KEY: {
                let focusIndex = this.state.focusIndex === this.state.answerList.length-1 ? this.state.answerList.length-1 : this.state.focusIndex+1;
                this.setState({
                    focusIndex: focusIndex
                });
                break;
            }
            case SPACE: {
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

    textBoxGenerator(props, focusIndex) {
        return (
            props.map((answer,index) => {
                let focus = index === focusIndex;
                return (
                    <div className="row radio radio-info">
                        <input maxLength="18" size="30" placeholder="Enter your answer here" ref={index} onFocus={() => this.handleFocus(index)}
                            defaultValue={answer} onChange={(event) => this.handleChange(event, index)} onKeyDown={event => this.handleEnterPress(event)}/>
                        <input type="radio" name="answer" />
                    </div>
                );
            })
        );
    }

    componentDidUpdate(){
        let focusIndex = this.state.focusIndex;
        this.refs[focusIndex].focus();
    }

    render() {
        return (
            <div className="col-lg-12 text-center">
                <h3 className={style.header3}>ANSWER INPUT</h3>
                <button className="btn btn-primary btn-success">Ready</button>
                <div>
                    {this.textBoxGenerator(this.state.answerList, this.state.focusIndex)}
                </div>
            </div>
        );
    }
};
