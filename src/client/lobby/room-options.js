import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateLetterSlider, updateNumberSlider, updateConundrumSlider } from './lobby-actions';

import style from './lobby.scss';

export class RoomOptions extends Component {
    handleLetterSliderChange(event) {
        this.props.updateLetterSlider(event.target.value);
    }

    handleNumberSliderChange(event) {
        this.props.updateNumberSlider(event.target.value);
    }

    handleConundrumSliderChange(event) {
        this.props.updateConundrumSlider(event.target.value);
    }

    letterSlider() {
        return(
            <div>
                Letters
                <input className={style.inputSlider} type="range" min="1" max="9" value={this.props.sliders.letterSlider}
                    onChange={(event) => this.handleLetterSliderChange(event)} />
                <div className={style.roundNumber}>
                    {this.props.sliders.letterSlider}
                </div>
            </div>
        );
    }

    numberSlider() {
        return(
            <div>
                Numbers
                <input className={style.inputSlider} type="range" min="1" max="9" value={this.props.sliders.numberSlider}
                onChange={(event) => this.handleNumberSliderChange(event)}/>
                <div className={style.roundNumber}>
                    {this.props.sliders.numberSlider}
                </div>
            </div>
        );
    }

    conundrumSlider() {
        return(
            <div>
                Conundrums
                <input className={style.inputSlider} type="range" min="1" max="9" value={this.props.sliders.conundrumSlider}
                onChange={(event) => this.handleConundrumSliderChange(event)}/>
                <div className={style.roundNumber}>
                    {this.props.sliders.conundrumSlider}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className={`col-lg-8 ${style.inputSliderWrapper}`}>
                <b>Rounds</b>
                <br />
                {this.props.roundTypes.letters ? this.letterSlider() : null}
                <br />
                {this.props.roundTypes.numbers ? this.numberSlider() : null}
                <br />
                {this.props.roundTypes.conundrum ? this.conundrumSlider() : null}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    sliders: {
        letterSlider: state.lobby.letterSlider,
        numberSlider: state.lobby.numberSlider,
        conundrumSlider: state.lobby.conundrumSlider
    },
    roundTypes: state.lobby.roundTypes
})

const mapDispatchToProps = dispatch => ({
    updateLetterSlider(value) {
        dispatch(updateLetterSlider(value));
    },
    updateNumberSlider(value) {
        dispatch(updateNumberSlider(value));
    },
    updateConundrumSlider(value) {
        dispatch(updateConundrumSlider(value));
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoomOptions)
