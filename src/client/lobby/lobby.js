import React, { Component } from 'react';
import { connect } from 'react-redux';

import cloakService from '../services/cloak-service';
import storageService from '../services/storage-service';

import style from './lobby.scss';

import UserList from '../user/user-list';
import RoomList from './room-list';
import RoomCreator from './room-creator';

export class Lobby extends Component {
    componentWillMount() {
        if(!cloakService.isConnected()){
            cloakService.configureAndRun();
        } else {
            cloakService.resetScore();
        }
    }

    handleChange(event) {
        cloakService.messageSetUsername(event.target.value);
        storageService.storeName(event.target.value);
    }

    getUsername() {
        return storageService.getUser().name;
    }

    render() {
        return (
            <div>
                <div className="text-center">
                    <h1>
                        Lobby
                        <i className="fa fa-internet-explorer" ></i>
                        <label className={style['set-username-label']}>
                            <label>Username:</label> 
                            <input className={style['set-username-input']} type="text" value={this.getUsername()}
                                onChange={(event) => this.handleChange(event)} />
                        </label>
                    </h1>
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
