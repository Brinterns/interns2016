import React, { Component } from 'react';
import { connect } from 'react-redux';

import cloakService from '../services/cloak-service';
import storageService from '../services/storage-service';

import NumbersInput from './numbers-input';

import style from './game.scss';

const numNumbers = 6;

export class NumbersRound extends Component {
    componentWillMount() {
        cloakService.messageGetRandomNumber();
    }

    componentWillReceiveProps(nextProps) {
        for(var i=0; i<numNumbers; i++){
            if(nextProps.numberList[i] !== undefined){
                this.refs[`box${i}`].className += this.refs[`box${i}`].className.includes(style.flipped) ? '' : ` ${style.flipped}` ;
            }
        }
    }

    isLeader() {
        let userId = storageService.getUser().id;
        if(userId === this.props.leader.id) {
            return true;
        }
        return false;
    }

    render() {
        const numberButtons = (
            <div>
                <button className="btn" id="get-large" onClick={() => cloakService.messageGetLarge()}
                disabled={this.props.disableLarge}>Large</button>
                <button className="btn" id="get-small" onClick={() => cloakService.messageGetSmall()}
                disabled={this.props.disableSmall}>Small</button>
            </div>
        );

        const numberBox = (number, index) => (
            <div className={style.flip}>
                <div className={style.card} ref={`box${index}`}>
                    <div className={`${style.face} ${style.front}`}>
                    </div>
                    <div ref={`card${index}`} className={`${style.face} ${style.back}`}>
                        <span className={style['card-inner']}>{number}</span>
                    </div>
                </div>
            </div>
        );

        let numberBoxes = [];
        for(let i=0; i<numNumbers; i++) {
            numberBoxes.push(numberBox(this.props.numberList[i], i));
        }

        return (
            <div className="col-lg-8 text-center">
                <h3>COUNTDOWN</h3>
                <div>
                    <p>Leader: {this.props.leader.name}</p>
                    {this.isLeader() ? numberButtons: null}
                </div>
                <div className={style['random-number']} id="random-number">
                    {this.props.randomNumber}
                </div>
                <div id="number-list">
                    {numberBoxes}
                </div>
                <NumbersInput />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    leader: state.game.leader,
    numberList: state.game.numberList,
    randomNumber: state.game.randomNumber,
    disableLarge: state.game.disableLarge,
    disableSmall: state.game.disableSmall
});

export default connect(
    mapStateToProps
)(NumbersRound)
