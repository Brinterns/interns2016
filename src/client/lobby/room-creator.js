import React, { Component } from 'react';

import config from '../config/config';

import style from './lobby.scss';

var username;
var roomname;

export default class RoomCreator extends Component {
    componentDidMount(){
        username = document.getElementById('user-name');
        roomname = document.getElementById('room-name');
    }
    render() {
        return (
            <div className="col-lg-4 text-center">
                <h2>Create Room & Set Username</h2>
                <div className="col-lg-12 list-group">
                    <div className={`row ${style.space}`}>
                        <input id="user-name" type="text" placeholder="Please type your new username"></input>
                        <button id="user-name-button" className="btn btn-success" onClick={() => onUsernameClick()}>Set Username</button>
                    </div>
                    <br></br>
                    <div className="row">
                        <input id="room-name" type="text" placeholder="Please type new room name"></input>
                        <button id="room-name-button" className="btn btn-success" onClick={() => onRoomnameClick()}>Create Room</button>
                    </div>
                </div>
            </div>
        );
    }
};

function onUsernameClick() {
    cloak.message('setUsername', username.value);
    localStorage.name = username.value;
}

function onRoomnameClick() {
    cloak.message('createRoom', roomname.value);
}