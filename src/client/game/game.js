import React, { Component } from 'react';
import { connect } from 'react-redux';

import AnswerInput from './answer-input';

import { setLeader, getConsonantDispatch, getVowelDispatch } from './game-actions';

import cloakService from '../services/cloak-service';

import { consonants, vowels, totalWeights } from './letter-lists';

export class Game extends Component {
    componentWillMount() {
        cloakService.setLeaderDispatch(this.props.setLeader);
        cloakService.setConsonantDispatch(this.props.getConsonantDispatch);
        cloakService.setVowelDispatch(this.props.getVowelDispatch);
    }

    render() {
        const buttons = (
            <div>
                <button className="btn btn-info" onClick={() => getConsonant()}>Consonant</button>
                <button className="btn btn-primary" onClick={() => getVowel()}>Vowel</button>
            </div>
        )

        return (
            <div className="col-lg-8 text-center">
                <h3>COUNTDOWN</h3>
                <p>{this.props.leader}</p>
                {buttons}
                {this.props.letterList}
                <AnswerInput />
            </div>
        );
    }
};

function getConsonant() {
    cloakService.messageGetConsonant();
}

function getVowel() {
    cloakService.messageGetVowel();
}

const mapStateToProps = state => ({
    leader: state.game.leader,
    letterList: state.game.letterList
});

const mapDispatchToProps = dispatch => ({
    setLeader(user) {
        dispatch(setLeader(user));
    },
    getConsonantDispatch(letter) {
        dispatch(getConsonantDispatch(letter));
    },
    getVowelDispatch(letter) {
        dispatch(getVowelDispatch(letter));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game);
