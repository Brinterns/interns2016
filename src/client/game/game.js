import React, { Component } from 'react';
import { connect } from 'react-redux';

import AnswerInput from './answer-input';

import { setLeader, getConsonantDispatch, getVowelDispatch, 
        disableConsonantDispatch, disableVowelDispatch } from './game-actions';

import cloakService from '../services/cloak-service';

import storageService from '../services/storage-service';

export class Game extends Component {
    componentWillMount() {
        cloakService.setLeaderDispatch(this.props.setLeader);
        cloakService.setConsonantDispatch(this.props.getConsonantDispatch);
        cloakService.setVowelDispatch(this.props.getVowelDispatch);
        cloakService.setDisableConsonantDispatch(this.props.disableConsonantDispatch);
        cloakService.setDisableVowelDispatch(this.props.disableVowelDispatch);
    }

    isLeader() {
        let userId = storageService.getUser().name;
        if(userId === this.props.leader) {
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
                <p>Leader: {this.props.leader}</p>
                {this.isLeader() ? letterButtons : null}
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
    letterList: state.game.letterList,
    disableConsonant: state.game.disableConsonant,
    disableVowel: state.game.disableVowel
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
    },
    disableConsonantDispatch(bool) {
        dispatch(disableConsonantDispatch(bool));
    },
    disableVowelDispatch(bool) {
        dispatch(disableVowelDispatch(bool));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game);
