import React, { Component } from 'react';

import config from '../config/config';
import Lobby from './lobby'
import RoomList from './room-list'
import RoomCreator from './room-creator'

import style from './lobby.scss'

export default  class LobbyPage extends Component {
    componentWillMount() {
        cloak.configure({
            // TODO: Add configuration
        });

        cloak.run(config.cloakAddress);
    }

    render() {
        return (
            <div className={'container-fluid '+ style.lobbyHeader}>
                <Lobby />
                <RoomList />
                <RoomCreator />
            </div>
        );
    }
};
