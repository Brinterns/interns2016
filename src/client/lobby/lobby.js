import React, { Component } from 'react';

import config from '../config/config';
import LobbyList from './lobby-list'

export default function Lobby(props) {
    return (
        <div className='col-lg-4 text-center'>
            <h1>Lobby</h1>
            <LobbyList lobbyUsers={props.lobbyUsers}/>
        </div>
    );
}
