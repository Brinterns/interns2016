import React, { Component } from 'react';

import config from '../config/config';

import cloakService from '../services/cloak-service';
import storageService from '../services/storage-service';

import style from './lobby.scss';

const ENTER_KEY = 13;

export default class RoomCreator extends Component {

    createRoom() {
        cloakService.messageCreateRoom(this.state.roomname);
    }

    handleRoomname(event) {
        this.setState({
            roomname: event.target.value
        });
    }

    handleEnterPress(event) {
        if(event.which === ENTER_KEY) {
            this.createRoom();
        }
    }

    render() {
        return (
            <div className="col-lg-4 text-center">
                        <i className="fa fa-cogs"></i>
                <h2>Controls </h2>
                <div className="col-lg-12 list-group">
                    <div className="row">
                        <input className={style['room-creator-input']} placeholder="Room Name"type="text" 
                        onChange={(event) => this.handleRoomname(event)} onKeyDown={event => this.handleEnterPress(event)}/>
                        <button className={`btn btn-success`} id="room-name-button"
                            onClick={() => this.createRoom()}>Create</button>
                    </div>
                </div>
            </div>
        );
    }
};
