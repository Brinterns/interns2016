import React, { Component } from 'react';
import { connect, dispatch } from 'react-redux';

import config from '../config/config';
import UserList from './user-list';
import RoomList from './room-list';
import RoomCreator from './room-creator';

import { refreshLobby } from '../actions';

import style from './lobby.scss';

export class Lobby extends Component {
    componentWillMount() {
        cloak.configure({
            messages: {
                refreshLobby: arg => {
                    this.props.refreshLobby(arg);
                }
            }
        });

        cloak.run(config.cloakAddress);
    }

    setUsername(arg){
        cloak.message('setUsername',arg);
    }

    render() {
        return (
            <div>
                <div className="text-center">
                    <h1>Lobby</h1>
                </div>
                <div className="container-fluid">
                    <UserList lobbyUsers={this.props.lobbyUsers} />
                    <RoomList />
                    <RoomCreator setUsername={this.setUsername}/>
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    lobbyUsers: state.lobbyUsers
});

const mapDispatchToProps = dispatch => {
    return {
        refreshLobby: arg => {
            dispatch(refreshLobby(arg));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby);
