import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateLetterSlider, updateNumberSlider } from './lobby-actions'; 

import style from './lobby.scss';

export class RoomOptions extends Component {
    handleLetterSliderChange(event) {
        this.props.updateLetterSlider(event.target.value);
    }

    handleNumberSliderChange(event) {
        this.props.updateNumberSlider(event.target.value);
    }

    letterSlider() {
        return(
            <div>
                Letters
                <input className={style['input-slider']} type="range" min="1" max="9" value={this.props.sliders.letterSlider}
                    onChange={(event) => this.handleLetterSliderChange(event)} />
                <div className={style['round-number']}>
                    {this.props.sliders.letterSlider}
                </div>
            </div>
        );
    }

    numberSlider() {
        return(
            <div>
                Numbers
                <input className={style['input-slider']} type="range" min="1" max="9" value={this.props.sliders.numberSlider}
                onChange={(event) => this.handleNumberSliderChange(event)}/>
                <div className={style['round-number']}>
                    {this.props.sliders.numberSlider}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className={`col-lg-8 ${style['input-slider-wrapper']}`}>
                {this.props.roundTypes.letters ? this.letterSlider() : null}
                {this.props.roundTypes.numbers ? this.numberSlider() : null}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    sliders: {
        letterSlider: state.lobby.letterSlider,
        numberSlider: state.lobby.numberSlider
    },
    roundTypes: state.lobby.roundTypes
})

const mapDispatchToProps = dispatch => ({
    updateLetterSlider(value) {
        dispatch(updateLetterSlider(value));
    },
    updateNumberSlider(value) {
        dispatch(updateNumberSlider(value));
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoomOptions)