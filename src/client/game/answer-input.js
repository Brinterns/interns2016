import React, { Component } from 'react';

import style from '../index.scss';

const textArea = {
    resize: 'none'
}

export default class AnswerInput extends Component {
    componentWillMount() {
        this.setState({
            textRows: 1
        });
    }

    handleEnterPress(event) {
        if(event.keyCode === 13 || event.which === 13) {
            window.alert('Enter Pressed');
        }
    }

    render() {
        return (
            <div className="col-lg-12 text-center">
                <h3 className={style.header3}>ANSWER INPUT</h3>
                <textarea className={style['text-area']} rows={this.state.textRows} cols="18" maxLength="18"
                    onKeyDown={ (event) => this.handleEnterPress(event)}/>
            </div>
        );
    }
};
