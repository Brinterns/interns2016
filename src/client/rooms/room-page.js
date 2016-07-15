import React, { Component } from 'react';
import { connect } from 'react-redux';

import router from '../services/routing-service';
import { messageLeaveRoom, messageJoinRoom, getRoomData, messageStartGame, setStartGame, isConnected } from '../services/cloak-service';

import UserList from '../user/user-list';
import Game from './game';

import { getRoomDetails, startGame } from '../actions';

export class RoomPage extends Component {
    componentWillMount() {
        if(isConnected()) {
            messageJoinRoom(this.props.params.data);
            getRoomData(this.props.params.data, this.props.getRoomDetails);
            setStartGame(this.props.startGame);
        } else {
            router.navigateToLobby();
        }
    }

    componentWillUnmount() {
        if(isConnected()) {
            messageLeaveRoom();
        }
    }

    render() {
        return (
            <div className="text-center">
                <h1>{`Room: ${this.props.roomData.name}`}</h1>
                <UserList users={this.props.roomUsers} />
                <div className="col-lg-8" >
                    <button id="start-game" className="btn btn-success" onClick={() => {messageStartGame()}}>Start Game</button>
                    <button id="leave-room" className="btn btn-danger" onClick={leaveRoom}>Leave Room</button>
                </div>
                {this.props.start ? <Game/> : null}
            </div>
        );
    }
};

function leaveRoom() {
    router.navigateToLobby();
}

const mapStateToProps = (state, ownProps) => ({
    roomUsers: state.roomUsers,
    roomData: state.roomData,
    start: state.startGame
});

const mapDispatchToProps = dispatch => {
    return {
        getRoomDetails: function(roomId) {
            dispatch(getRoomDetails(roomId));
        },
        startGame: function(start) {
            dispatch(startGame(start));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoomPage);
