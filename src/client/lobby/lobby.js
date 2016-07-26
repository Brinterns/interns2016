import React, { Component } from 'react';
import { connect } from 'react-redux';

import cloakService from '../services/cloak-service.js';

import UserList from '../user/user-list';
import RoomList from './room-list';
import RoomCreator from './room-creator';

export class Lobby extends Component {
    componentWillMount() {
        if(!cloakService.isConnected()){
            cloakService.configureAndRun();
        }
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

export default connect(
    mapStateToProps
)(Lobby);
