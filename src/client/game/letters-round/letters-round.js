import React, { Component } from 'react';
import { connect } from 'react-redux';

import LettersInput from './letters-input';
import RoundResults from '../round-results';

import cloakService from '../../services/cloak-service';

import storageService from '../../services/storage-service';

import style from '../game.scss';

const numLetters = 9;

export class LettersRound extends Component {
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
                this.refs[`letterBox${i}`].className += this.refs[`letterBox${i}`].className.includes(style.flipped) ? '' : ` ${style.flipped}` ;
            }
        }

        if(nextProps.resetRound !== this.props.resetRound && nextProps.resetRound) {
            this.resetLetterBoxes();
        }
    }

    resetLetterBoxes() {
        for(let i=0; i<numLetters; i++) {
            this.refs[`letterBox${i}`].className = style.card;
        }
    }

    render() {
        const letterButtons = (
            <div>
                <button className="btn" onClick={() => cloakService.messageGetConsonant()}
                disabled={this.props.disableConsonant}>Consonant</button>
                <button className="btn" onClick={() => cloakService.messageGetVowel()}
                disabled={this.props.disableVowel}>Vowel</button>
            </div>
        );

        const letterBox = (letter, index) => (
            <div className={style.flip}>
                <div className={style.card} ref={`letterBox${index}`}>
                    <div className={`${style.face} ${style.front}`}>
                    </div>
                    <div ref={`letterCard${index}`} className={`${style.face} ${style.back}`}>
                        <span className={style.cardInner}>{letter}</span>
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
                <div>
                    <p>Leader: {this.props.leader.name}</p>
                    {this.isLeader() ? letterButtons : null}
                    <div>
                        {letterBoxes}
                    </div>
                    {this.props.roundResults ?
                        <RoundResults />
                    :
                        <LettersInput />
                    }
                </div>
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
    resetRound: state.game.resetRound
});

export default connect(
    mapStateToProps
)(LettersRound);
