import React, { Component } from 'react';
import { connect } from 'react-redux';

import AnswerInput from './answer-input';

import cloakService from '../services/cloak-service';

import storageService from '../services/storage-service';

import style from './game.scss';

export class Game extends Component {
    isLeader() {
        let userId = storageService.getUser().id;
        if(userId === this.props.leader.id) {
            return true;
        }
        return false;
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.letterList.length-1 >= 0){
            this.refs[`box${nextProps.letterList.length-1}`].className += ` ${style.flipped}`;
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
                    <div className={`${style.face} ${style.back}`}>
                        {letter}
                    </div>
                </div>
            </div>
        );

        let letterBoxes = [];
        for(let i = 0; i < 9; i++) {
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
                <AnswerInput answering={this.props.answering} />
            </div>
        );
    }
}


const mapStateToProps = state => ({
    leader: state.game.leader,
    letterList: state.game.letterList,
    disableConsonant: state.game.disableConsonant,
    disableVowel: state.game.disableVowel,
    answering: state.game.answering
});

export default connect(
    mapStateToProps
)(Game);
