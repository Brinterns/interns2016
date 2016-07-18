import React, { Component } from 'react';

import style from '../index.scss';

const textArea = {
    resize: 'none'
}

export default class AnswerInput extends Component {
    componentWillMount() {
        this.setState({
            textRows: 1,
            maxLength: 18
        });
    }

    handleEnterPress(event) {
        if(event.keyCode === 13 || event.which === 13) {
            this.setState({
                textRows: (this.state.textRows + 1),
                maxLength: (this.state.maxLength + 20)
            });
        }
    }

    render() {
        return (
            <div className="col-lg-12 text-center">
                <h3 className={style.header3}>ANSWER INPUT</h3>
                <textarea className={style['text-area']} rows={this.state.textRows} cols="25" maxLength={this.state.maxLength}
                    onKeyDown={ (event) => this.handleEnterPress(event)}/>
            </div>
        );
    }
};
