import React, { Component } from 'react';

import cloakService from '../../services/cloak-service';
import style from '../game.scss';

export default class ConundrumInput extends Component {
    componentWillMount() {
        this.setState({
            submitted: false
        });
    }

    submitAnswer() {
        cloakService.messageSubmitAnagram(this.state.answer);
        this.setState({
            submitted: true
        });
    }

    handleChange(event) {
        this.setState({
            answer: event.target.value
        });
    }

    render() {
        const submitButton = (
            <div>
                <button className={`btn btn-success ${style['submit-button']}`} onClick={() => this.submitAnswer.bind(this)()}>Submit</button>
            </div>
        );

        return (
            <div className="col-lg-12 text-center">
                <h3>Answer</h3>
                <input maxLength="20" size="30" placeholder="Answer here"
                onChange={(event) => this.handleChange(event)} />
                {!this.state.submitted ? submitButton : null}
            </div>
        );
    }
}
