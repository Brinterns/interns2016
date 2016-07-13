import React, { Component } from 'react';
import { connect } from 'react-redux';

import { configureAndRun } from '../services/cloak-service.js';

import UserList from './user-list';
import RoomList from './room-list';
import RoomCreator from './room-creator';

import { refreshLobby, refreshRooms, refreshRoomUsers } from '../actions';

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
