import React, { Component } from 'react';

import style from '../game.scss';
import cloakService from '../../services/cloak-service';

export default class ConundrumInput extends Component {
    submitAnswer() {
        cloakService.messageSubmitAnagram(this.state.answer);
    }

    handleChange(event) {
        this.setState({
            answer: event.target.value
        });
    }
    render() {
        const submitButton = (
            <div>
                <button className={`btn btn-success ${style['submit-button']}`} onClick={() => this.submitAnswer()}>Submit</button>
            </div>
        );

        return (
            <div className="col-lg-12 text-center">
                <h3>Answer</h3>
                <input maxLength="20" size="30" placeholder="Answer here"
                onChange={(event) => this.handleChange(event)} />
                {submitButton}
            </div>
        );
    }
}
