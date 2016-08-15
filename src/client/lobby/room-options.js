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

    render() {
        return (
            <div className={`col-lg-8 ${style['input-slider-wrapper']}`}>
                Letters
                <input className={style['input-slider']} type="range" min="1" max="9" 
                onChange={(event) => this.handleLetterSliderChange(event)}/>
                <div className={style['round-number']}>
                    {this.props.sliders.letterSlider}
                </div>
                <br></br>
                Numbers
                <input className={style['input-slider']} type="range" min="1" max="9" 
                onChange={(event) => this.handleNumberSliderChange(event)}/>
                <div className={style['round-number']}>
                    {this.props.sliders.numberSlider}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    sliders: {
        letterSlider: state.lobby.letterSlider,
        numberSlider: state.lobby.numberSlider
    }
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