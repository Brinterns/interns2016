import React, { Component } from 'react';
import { connect } from 'react-redux';

import cloakService from '../services/cloak-service';
import storageService from '../services/storage-service';
import routingService from '../services/routing-service';

import { resetSliders } from './lobby-actions';

import style from './lobby.scss';

import UserList from '../user/user-list';
import RoomList from './room-list';

export class Lobby extends Component {
    componentWillMount() {
        this.props.resetSliders();
        this.redirectFlaps(this.getUsername());

        if(!cloakService.isConnected()){
            cloakService.configureAndRun();
        } else {
            cloakService.resetScore();
        }
    }

    redirectFlaps(value) {
        if(value !== undefined && value.toLowerCase() === 'flaps') {
            storageService.storeName('RIP flaps');
            routingService.redirect('http://youareanidiot.org/');
        }
    }

    handleChange(event) {
        const value = event.target.value;

        this.redirectFlaps(value);

        cloakService.messageSetUsername(value);
        storageService.storeName(value);
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
                        <label className={style.setUsernameLabel}>
                            <label>Username:</label>
                            <input className={style.setUsernameInput} type="text" value={this.getUsername()}
                                onChange={(event) => this.handleChange(event)} />
                        </label>
                    </h1>
                </div>
                <div className="container-fluid">
                    <UserList users={this.props.lobbyUsers} />
                    <RoomList roomList={this.props.activeRooms}/>
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
    resetSliders() {
        dispatch(resetSliders());
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby);
