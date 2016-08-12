import React, { Component } from 'react';

import style from './game.scss'

export default function Progress(props) {
    let barStyle = {
        width: `${props.timeLeft===undefined ? 0 : 100-((100*props.timeLeft)/props.maxTime)}%`,
        transition: {
            duration: '1000ms'
        }
    };
    let progressClass;
    switch(props.whichTimer){
        case 'answer':
            progressClass='progress-bar progress-bar-danger progress-bar-striped active';
            break;
        case 'submission':
            progressClass='progress-bar progress-bar-success progress-bar-striped active';
            break;
    }

    return(
        <div className={`progress ${style.timers}`}>
            <div className={progressClass} role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={barStyle}>
            </div>
        </div>
    );
}
