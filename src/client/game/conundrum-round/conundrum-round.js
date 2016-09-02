import React, { Component } from 'react';
import { connect } from 'react-redux';

import ConundrumInput from './conundrum-input';

import style from '../game.scss';

export class ConundrumRound extends Component {
    // flipLetters() {
    //     for(var i=0; i< conundrum.length; i++){
    //         this.refs[`letterBox${i}`].className += this.refs[`letterBox${i}`].className.includes(style.flipped) ? '' : ` ${style.flipped}` ;
    //     }
    // }

    render() {
        // const letterBox = (letter, index) => (
        //     <div className={style.flip}>
        //         <div className={style.card} ref={`letterBox${index}`}>
        //             <div className={`${style.face} ${style.front}`}>
        //             </div>
        //             <div ref={`letterCard${index}`} className={`${style.face} ${style.back}`}>
        //                 <span className={style.cardInner}>{letter}</span>
        //             </div>
        //         </div>
        //     </div>
        // );

        // let letterBoxes = [];
        // for(let i = 0; i < conundrum.length; i++) {
        //     letterBoxes.push(letterBox(conundrum[i], i));
        // }

        return (
            <div className="col-lg-8 text-center">
                <h3>
                    Conundrum
                </h3>
                {letterBoxes}
                <ConundrumInput />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    conundrum: state.game.conundrum
});

export default connect(
    mapStateToProps
)(ConundrumRound)
