import React, { Component } from 'react';
import { connect } from 'react-redux';

import DDoris from './ddoris';

import style from '../game.scss';
import bannerStyles from './conundrum-round.scss';

export class ConundrumResults extends Component {
    constructor() {
        super();
        this.state = {
            flippedLetterBoxes: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.conundrumResults !== this.props.conundrumResults) {
            this.conundrumTimer = setTimeout(() => this.flipLetters(), 500);
        }
    }

    flipLetters() {
        this.setState({
            flippedLetterBoxes: !this.state.flippedLetterBoxes
        });
    }

    render() {
        const name = this.props.conundrumResults.winner !== undefined ? this.props.conundrumResults.winner.name : null;

        const flipLetters = this.state.flippedLetterBoxes ? style.flipped : '';

        const letterBox = (letter, index) => (
            <div className={style.flip}>
                <div className={`${style.card} ${flipLetters}`}>
                    <div className={`${style.face} ${style.front}`}>
                    </div>
                    <div className={`${style.face} ${style.back}`}>
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
