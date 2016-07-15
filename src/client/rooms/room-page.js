import React, { Component } from 'react';
import { connect } from 'react-redux';

import router from '../services/routing-service';
import { messageLeaveRoom, messageJoinRoom, getRoomData, messageStartGame, setStartGame, isConnected } from '../services/cloak-service';

import UserList from '../user/user-list';
import Game from './game';

import { getRoomDetails, startGame } from '../actions';
import { getRoom, getUser } from '../services/storage-service';

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
                    <button id="start-game" className="btn btn-success" disabled={disable.bind(this)()} 
                            onClick={() => {messageStartGame()}}>Start Game</button>
                    <button id="leave-room" className="btn btn-danger" onClick={leaveRoom}>Leave Room</button>
                </div>
                {this.props.start ? <Game/> : null}
            </div>
        );
    }
};

function disable() {
    if(enoughPlayers.bind(this)()){
        return !isCreator();
    }
    return true;
}
function enoughPlayers() {
    return this.props.roomUsers.length >= 2 ? true : false;
}

function isCreator() {
    var room = getRoom();
    var creator = room.data.creator;
    var user = getUser();
    return JSON.stringify(creator) === JSON.stringify(user);
}

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
