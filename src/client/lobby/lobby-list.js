import React, { Component } from 'react';

import config from '../config/config';
import style from './lobby.scss'

export default function Lobby(props) {
    return (
        <div className={style.lobbyListElements}>
            {props.lobbyUsers.map( result => {
                return (
                    <p className='row' key={result['id']}>
                        {result['name']}
                    </p>
                );
            })}
        </div>
    );
}
