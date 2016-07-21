import React, { Component } from 'react';
import { connect } from 'react-redux';

import AnswerInput from './answer-input';

import cloakService from '../services/cloak-service';

import storageService from '../services/storage-service';

import { consonants, vowels, totalWeights } from './letter-lists';

export class Game extends Component {
    isLeader() {
        let userId = storageService.getUser().id;
        if(userId === this.props.leader.id) {
            return true;
        }
        return false;
    }

    render() {
        const letterButtons = (
            <div>
                <button className="btn btn-info" onClick={() => cloakService.messageGetConsonant()}
                disabled={this.props.disableConsonant}>Consonant</button>
                <button className="btn btn-primary" onClick={() => cloakService.messageGetVowel()}
                disabled={this.props.disableVowel}>Vowel</button>
            </div>
        );

        return (
            <div className="col-lg-8 text-center">
                <h3>COUNTDOWN</h3>
                <p>Leader: {this.props.leader.name}</p>
                {this.isLeader() ? letterButtons : null}
                <div>
                    {this.props.letterList}
                </div>
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

const mapStateToProps = state => ({
    leader: state.game.leader,
    letterList: state.game.letterList,
    disableConsonant: state.game.disableConsonant,
    disableVowel: state.game.disableVowel
});

export default connect(
    mapStateToProps
)(Game);
