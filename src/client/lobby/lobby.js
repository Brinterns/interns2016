import React, { Component } from 'react';
import { connect } from 'react-redux';

import { configureAndRun } from '../services/cloak-service.js';

import UserList from '../user/user-list';
import RoomList from './room-list';
import RoomCreator from './room-creator';

import { refreshLobby, refreshRooms} from './lobby-actions';
import { refreshRoomUsers } from '../rooms/room-actions'; 

export class Lobby extends Component {
    componentWillMount() {
        configureAndRun(this.props.refreshLobby, this.props.refreshRooms, this.props.refreshRoomUsers);
    }

    render() {
        return (
            <div>
                <div className="text-center">
                    <h1>Lobby</h1>
                </div>
                <div className="container-fluid">
                    <UserList users={this.props.lobbyUsers} />
                    <RoomList roomList={this.props.activeRooms}/>
                    <RoomCreator />
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    lobbyUsers: state.lobby.users,
    activeRooms: state.lobby.rooms
});

const mapDispatchToProps = dispatch => ({
    refreshLobby(lobbyList) {
        dispatch(refreshLobby(lobbyList));
    },
    refreshRooms(roomList) {
        dispatch(refreshRooms(roomList));
    },
    refreshRoomUsers(roomUsers) {
        dispatch(refreshRoomUsers(roomUsers));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby);
