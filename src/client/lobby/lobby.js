import React, { Component } from 'react';

import config from '../config/config';
import UserList from './user-list'
import RoomList from './room-list'
import RoomCreator from './room-creator'

import style from './lobby.scss'

export default  class Lobby extends Component {
    componentWillMount() {
        cloak.configure({
            // TODO: Add configuration
        });

        cloak.run(config.cloakAddress);
    }

    render() {
        return (
            <div>
                <div className="text-center">
                    <h1>Lobby</h1>
                </div>
                <div className="container-fluid">
                    <UserList />
                    <RoomList />
                    <RoomCreator />
                </div>
            </div>
        );
    }
};
