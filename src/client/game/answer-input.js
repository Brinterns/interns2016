import React, { Component } from 'react';

import style from '../index.scss';

export default class AnswerInput extends Component {
    componentWillMount() {
        this.setState({
            answerList: ['']
        });
    }

    handleEnterPress(event) {
        if(event.keyCode === 13 || event.which === 13) {
            this.setState({
                answerList: [...this.state.answerList, 'Enter your answer here']
            });
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

    textBoxGenerator(props) {
        return (
            props.map((answer,index) => {
                let focus = index === props.length-1;
                return (
                    <div className="row">
                        <input maxLength="18" size="30" placeholder="Enter your answer here" autoFocus={focus}
                            defaultValue={answer} onChange={(event) => this.handleChange(event, index)} onKeyDown={event => this.handleEnterPress(event)}/>
                    </div>
                );
            })
        );
    }

    render() {
        return (
            <div className="col-lg-12 text-center">
                <h3 className={style.header3}>ANSWER INPUT</h3>
                <div>
                    {this.textBoxGenerator(this.state.answerList)}
                </div>
            </div>
        );
    }
};
