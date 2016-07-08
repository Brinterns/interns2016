import React, { Component } from 'react';
import { connect, dispatch } from 'react-redux';

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

    setUsername(arg){
        cloak.message('setUsername',arg);
        localStorage.name = arg;
    }

    createRoom(arg){
        cloak.message('createRoom', arg);
    }

    render() {
        return (
            <div>
                <div className="text-center">
                    <h1>Lobby</h1>
                </div>
                <div className="container-fluid">
                    <UserList lobbyUsers={this.props.lobbyUsers} />
                    <RoomList roomList={this.props.activeRooms}/>
                    <RoomCreator setUsername={this.setUsername} setRoomname={this.createRoom}/>
                </div>
            </div>
        );
    }
};

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
