import React, { Component } from 'react';
import { connect } from 'react-redux';

import AnswerInput from './answer-input';

import { setLeader } from './game-actions';

import cloakService from '../services/cloak-service';

import { consonants, vowels, totalWeights } from './letter-lists';

export class Game extends Component {
    componentWillMount() {
        cloakService.setLeaderDispatch(this.props.setLeader);
    }

    render() {
        const buttons = (
            <div>
                <button className="btn btn-info">Consonant</button>
                <button className="btn btn-primary">Vowel</button>
            </div>
        )

        return (
            <div className="col-lg-8 text-center">
                <h3>COUNTDOWN</h3>
                <p>{this.props.leader}</p>
                {randomLetter()}
                <AnswerInput />
            </div>
        );
    }
};

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function getRandomItem(letterList) {
    let totalWeight = totalWeights.consonants;
    let randomNum = randomInteger(0, totalWeight);
    let weightSum = 0;

    for(let letter in letterList) {
        weightSum += letterList[letter];
        if(randomNum <= weightSum) {
            return letter;
        }
    }
}

function randomLetter() {
    let randomItem = getRandomItem(consonants);
    return(
        <p>{randomItem}</p>
    )
}

const mapStateToProps = state => ({
    leader: state.game.leader
});

const mapDispatchToProps = dispatch => ({
    setLeader(user) {
        dispatch(setLeader(user));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game);
