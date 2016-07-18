import React, { Component } from 'react';

import style from '../index.scss';
import AnswerInput from './answer-input';

export default class Game extends Component{
    render() {
        return (
            <div className="col-lg-8 text-center">
                <h3 className={style.header3}>THIS IS GAME</h3>
                <AnswerInput />
            </div>
        );
    }
};
