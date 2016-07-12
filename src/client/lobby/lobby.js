import React, { Component } from 'react';
import { connect, dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { browserHistory } from 'react-router';

import configure from './cloak-configure.js'
import config from '../config/config';

import UserList from './user-list';
import RoomList from './room-list';
import RoomCreator from './room-creator';

import { refreshLobby, refreshRooms, refreshRoomUsers } from '../actions';

import style from './lobby.scss';

export class Lobby extends Component {
    componentWillMount() {
        configure(this.props.refreshLobby, this.props.refreshRooms, this.props.refreshRoomUsers);
        cloak.run(config.cloakAddress);
    }
    render() {
        return (
            <div>
                <div className="text-center">
                    <h1>Lobby</h1>
                </div>
                <div className="container-fluid">
                    <UserList users={this.props.lobbyUsers} />
                    <RoomList roomList={this.props.activeRooms} joinRoom={joinRoom} />
                    <RoomCreator setUsername={setUsername} setRoomname={createRoom} />
                </div>
            </div>
        );
    }
};

function setUsername(arg) {
    cloak.message('setUsername',arg);
    localStorage.name = arg;
}

function createRoom(arg) {
    cloak.message('createRoom', arg);
}

function joinRoom(arg) {
    cloak.message('joinRoom', arg.id);
    redirectToRoom(arg.name);
}

function redirectToRoom(arg){
    browserHistory.push(`/room/${arg}`);
}

const mapStateToProps = state => ({
    lobbyUsers: state.lobbyUsers,
    activeRooms: state.activeRooms,
    roomUsers: state.roomUsers
});

const mapDispatchToProps = dispatch => {
    return {
        refreshLobby: arg => {
            dispatch(refreshLobby(arg));
        },
        refreshRooms: arg => {
            dispatch(refreshRooms(arg));
        },
        refreshRoomUsers: arg => {
            dispatch(refreshRoomUsers(arg));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby);
