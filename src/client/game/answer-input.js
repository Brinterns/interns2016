import React, { Component } from 'react';

import style from '../index.scss';

export default class AnswerInput extends Component {
    componentWillMount() {
        this.setState({
            answerList: [''],
            focusIndex: 0
        });
    }

    handleEnterPress(event) {
        switch (event.which) {
            case 13: { //Enter key press
                this.setState({
                    answerList: [...this.state.answerList, 'Enter your answer here'],
                    focusIndex: this.state.answerList.length
                });
                break;
            }
            case 38: {
                let focusIndex = this.state.focusIndex === 0 ? 0 : this.state.focusIndex-1;
                this.setState({
                    focusIndex: focusIndex
                });
                break;
            }
            case 40: {
                let focusIndex = this.state.focusIndex === this.state.answerList.length-1 ? this.state.answerList.length-1 : this.state.focusIndex+1;
                this.setState({
                    focusIndex: focusIndex
                });
                break;
            }
        }
    }

    handleChange(event, id) {
        console.log(this.state.answerList);
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

    textBoxGenerator(props, focusIndex) {
        return (
            props.map((answer,index) => {
                let focus = index === focusIndex;
                console.log(focus+' '+index);
                return (
                    <div className="row">
                        <input maxLength="18" size="30" placeholder="Enter your answer here" ref={index}
                            defaultValue={answer} onChange={(event) => this.handleChange(event, index)} onKeyDown={event => this.handleEnterPress(event)}/>
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
                <div>
                    {this.textBoxGenerator(this.state.answerList, this.state.focusIndex)}
                </div>
            </div>
        );
    }
};
