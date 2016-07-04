import React, { Component } from 'react';

import config from '../config/config';

export default function Lobby(props) {
    return (
        <ul>
            {props.lobbyUsers.map( result => {
                return (
                    <li key={result['id']}>
                        {result['name']}
                    </li>
                );
            })}
        </ul>
    );
}
