import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateLetterSlider } from './lobby-actions'; 

import style from './lobby.scss';


export class RoomOptions extends Component {
    handleLetterSliderChange(event) {
        this.props.updateLetterSlider(event.target.value);
    }

    render() {
        return (
            <div className={`col-lg-4 ${style['input-slider-wrapper']}`}>
                letters
                <input className={style['input-slider']} type="range" min="1" max="9" 
                onChange={(event) => this.handleLetterSliderChange(event)}/>
                <div>{this.props.letterSlider}</div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    letterSlider: state.lobby.letterSlider
})

const mapDispatchToProps = dispatch => ({
    updateLetterSlider(value) {
        dispatch(updateLetterSlider(value));
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoomOptions)