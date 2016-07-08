import React, { Component } from 'react';
import { connect, dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { browserHistory } from 'react-router';

import configure from './cloak-configure.js'
import config from '../config/config';

import UserList from './user-list';
import RoomList from './room-list';
import RoomCreator from './room-creator';

import { refreshLobby, refreshRooms } from '../actions';

import style from './lobby.scss';

export class Lobby extends Component {
    componentWillMount() {
        configure(this.props.refreshLobby, this.props.refreshRooms);
        cloak.run(config.cloakAddress);
    }

    setUsername(arg) {
        cloak.message('setUsername',arg);
        localStorage.name = arg;
    }

    createRoom(arg) {
        cloak.message('createRoom', arg);
        browserHistory.push(`/room/${arg}`);
    }

    joinRoom(arg) {
        cloak.message('joinRoom', arg)
    }

    render() {
        return (
            <div>
                <div className="text-center">
                    <h1>Lobby</h1>
                </div>
                <div className="container-fluid">
                    <UserList lobbyUsers={this.props.lobbyUsers} />
                    <RoomList roomList={this.props.activeRooms} joinRoom={this.joinRoom} />
                    <RoomCreator setUsername={this.setUsername} setRoomname={this.createRoom} />
                </div>
            </div>
        );
    }
};

function redirectToRoom(arg){
    browserHistory.push(`/room/${arg}`);
}

const mapStateToProps = state => ({
    lobbyUsers: state.lobbyUsers,
    activeRooms: state.activeRooms
});

const mapDispatchToProps = dispatch => {
    return {
        refreshLobby: arg => {
            dispatch(refreshLobby(arg));
        },
        refreshRooms: arg => {
            dispatch(refreshRooms(arg));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby);
