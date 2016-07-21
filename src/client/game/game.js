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
        return (
            <div className="col-lg-8 text-center">
                <h3>COUNTDOWN</h3>
                <p>leader: {this.props.leader}</p>
                <div>
                    <button className="btn btn-info" onClick={() =>  messageGetConsonant()}>Consonant</button>
                    <button className="btn btn-primary" onClick={() => messageGetVowel()}>Vowel</button>
                </div>
                <div>
                    {this.props.letterList}
                </div>
                <AnswerInput />
            </div>
        );
    }
};

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
