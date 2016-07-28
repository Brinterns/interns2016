import React, { Component } from 'react';
import { connect } from 'react-redux';

import router from '../services/routing-service';
import cloakService from '../services/cloak-service';

import UserList from '../user/user-list';
import Game from '../game/game';

import { leaveGame } from '../game/game-actions';
import storageService from '../services/storage-service';

export class RoomPage extends Component {
    componentWillMount() {
        if(cloakService.isConnected()) {
            cloakService.messageJoinRoom(this.props.params.data);
            cloakService.getRoomData(this.props.params.data);
        } else {
            router.navigateToLobby();
        }
    }

    componentWillUnmount() {
        if(cloakService.isConnected()) {
            this.props.leaveGame();
            cloakService.messageLeaveRoom();
        }
    }

    render() {
        return (
            <div className="text-center">
                <h1>{`Room: ${this.props.roomData.name}`}</h1>
                <UserList users={this.props.roomUsers} />
                <div className="col-lg-8" >
                    <button className={`btn btn-success`} id="start-game" disabled={this.props.disableStart}
                            onClick={() => {cloakService.messageStartGame()}}>Start Game</button>
                    <button className={`btn btn-danger`} id="leave-room"
                            onClick={leaveRoom}>Leave Room</button>
                </div>
                {this.props.started ? <Game /> : null}
            </div>
        );
    }
};

function leaveRoom() {
    router.navigateToLobby();
}

const mapStateToProps = (state, ownProps) => ({
    roomUsers: state.room.users,
    roomData: state.room.data,
    started: state.game.started,
    disableStart: state.game.disableStart
});

const mapDispatchToProps = dispatch => ({
    leaveGame() {
        dispatch(leaveGame());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoomPage);
