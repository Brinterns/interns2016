import React, { Component } from 'react';

import config from '../config/config';

import cloakService from '../services/cloak-service';
import storageService from '../services/storage-service';

import style from './lobby.scss';

export default class RoomCreator extends Component {
    setUsername() {
        cloakService.messageSetUsername(this.state.username);
        storageService.storeName(this.state.username);
    }

    createRoom() {
        cloakService.messageCreateRoom(this.state.roomname);
    }

    handleChange(event, property) {
        this.setState({
            [property]: event.target.value
        });
    }

    render() {
        return (
            <div className="col-lg-4 text-center">
                <h2>Create Room & Set Username</h2>
                <div className="col-lg-12 list-group">
                    <div className={'row space'}>
                        <input className={style['room-creator-input']}type="text" placeholder="Please type your new username"
                            onChange={(event) => this.handleChange(event, 'username')} />
                        <button className={`btn btn-success`} id="user-name-button"
                            onClick={() => this.setUsername()}>Set Username</button>
                    </div>
                    <br></br>
                    <div className="row">
                        <input className={style['room-creator-input']} type="text" placeholder="Please type new room name"
                            onChange={(event) => this.handleChange(event, 'roomname')} />
                        <button className={`btn btn-success`} id="room-name-button"
                            onClick={() => this.createRoom()}>Create Room</button>
                    </div>
                </div>
            </div>
        );
    }
};
