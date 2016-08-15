import React, { Component } from 'react';
import { connect } from 'react-redux';

import AnswerInput from './answer-input';
import RoundResults from './round-results';

import cloakService from '../services/cloak-service';

import storageService from '../services/storage-service';

import style from './game.scss';

const numLetters = 9;

export class Game extends Component {
    isLeader() {
        let userId = storageService.getUser().id;
        if(userId === this.props.leader.id) {
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {
        for(var i=0; i<numLetters; i++){
            if(nextProps.letterList[i] !== undefined){
                this.refs[`box${i}`].className += this.refs[`box${i}`].className.includes(style.flipped) ? '' : ` ${style.flipped}` ;
            }
        }

        if(nextProps.resetRound !== this.props.resetRound && nextProps.resetRound) {
            this.resetLetterBoxes();
        }
    }

    resetLetterBoxes() {
        for(let i=0; i<numLetters; i++) {
            this.refs[`box${i}`].className = style.card;
        }
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

        const letterBox = (letter, index) => (
            <div className={style.flip}>
                <div className={style.card} ref={`box${index}`}>
                    <div className={`${style.face} ${style.front}`}>
                    </div>
                    <div ref={`card${index}`} className={`${style.face} ${style.back}`}>
                        {letter}
                    </div>
                </div>
            </div>
        );

        let letterBoxes = [];
        for(let i = 0; i < numLetters; i++) {
            letterBoxes.push(letterBox(this.props.letterList[i], i));
        }

        return (
            <div className="col-lg-8 text-center">
                <h3>COUNTDOWN</h3>
                <p>Leader: {this.props.leader.name}</p>
                {this.isLeader() ? letterButtons : null}
                <div>
                    {letterBoxes}
                </div>
                {
                    (!this.props.gameFinished ? 
                        (this.props.roundResults ? <RoundResults /> :
                            <AnswerInput answering={this.props.answering} submission={this.props.submission}/>) :
                        <div>
                            GAME DONE GJ GUYS
                        </div>
                    )

                }
            </div>
        );
    }
}


const mapStateToProps = state => ({
    leader: state.game.leader,
    letterList: state.game.letterList,
    disableConsonant: state.game.disableConsonant,
    disableVowel: state.game.disableVowel,
    answering: state.game.answering,
    submission: state.game.submission,
    roundResults: state.game.roundResults,
    resetRound: state.game.resetRound,
    gameFinished: state.game.gameFinished
});

export default connect(
    mapStateToProps
)(Game);
