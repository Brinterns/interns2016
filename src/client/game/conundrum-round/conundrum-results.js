import React, { Component } from 'react';
import { connect } from 'react-redux';

import DDoris from './ddoris';

import style from '../game.scss';
import bannerStyles from './conundrum-round.scss';

export class ConundrumResults extends Component {
    componentWillReceiveProps(nextProps) {
        if(nextProps.conundrumResults !== this.props.conundrumResults) {
            this.conundrumTimer = setTimeout(this.flipLetters.bind(this), 500);
        }
    }

    flipLetters() {
        for(var i=0; i< this.props.conundrumResults.solution.length; i++){
            this.refs[`letterBox${i}`].className += this.refs[`letterBox${i}`].className.includes(style.flipped) ? '' : ` ${style.flipped}` ;
        }
    }

    render() {
        const name = this.props.conundrumResults.winner !== undefined ? this.props.conundrumResults.winner.name : null;
    
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
        if(this.props.conundrumResults.solution !== undefined){
            for(let i = 0; i < this.props.conundrumResults.solution.length; i++) {
                letterBoxes.push(letterBox(this.props.conundrumResults.solution[i].toUpperCase(), i));
            }
        }

        return (
            <div className="col-lg-12 text-center">
                {name !== null ?
                    <div>
                        <div className="row">
                            {letterBoxes}
                        </div>
                        <div className={`${bannerStyles.banner} ${bannerStyles.ribbon} ${bannerStyles.colours}`}>
                            {name}
                        </div>
                    </div>
                : 
                    <DDoris solution={this.props.conundrumResults.solution}/>
                }
                
            </div>
        );
    }
}

const mapStateToProps = state => ({
    conundrumResults: state.game.conundrumResults
});

export default connect(
    mapStateToProps
)(ConundrumResults)
