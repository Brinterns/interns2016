import React, { Component } from 'react';
import { connect, dispatch } from 'react-redux';

import config from '../config/config';
import Lobby from './lobby';
import RoomList from './room-list';
import RoomCreator from './room-creator';

import { refreshLobby } from '../actions';

export class LobbyPage extends Component {
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

    render() {
        return (
            <div className='container-fluid'>
                <Lobby lobbyUsers={this.props.lobbyUsers}/>
                <RoomList />
                <RoomCreator />
            </div>
        );
    }
};

const mapStateToProps = (state) => ({
    lobbyUsers: state.lobbyUsers
});

const mapDispatchToProps = (dispatch) => {
    return {
        refreshLobby: arg => {
            dispatch(refreshLobby(arg));
        }
    }
}

export default connect (
    mapStateToProps,
    mapDispatchToProps
)(LobbyPage);
