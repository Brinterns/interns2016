import React, { Component } from 'react';
import { connect } from 'react-redux';

import router from '../services/routing-service';
import { messageLeaveRoom, messageJoinRoom, getRoomData, isConnected } from '../services/cloak-service';

import UserList from '../user/user-list';
import { getRoomDetails } from '../actions';

export class RoomPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            roomData: []
        };
    }
    componentWillMount() {
        if(isConnected()) {
            messageJoinRoom(this.state.roomData);
            getRoomData(this.state.roomData, this.props.getRoomDetails);
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
                <h1>{`Room: ${this.state.roomData}`}</h1>
                <UserList users={this.props.roomUsers} />
                <div className="col-lg-8" >
                    <button id="start-game" className="btn btn-success">Start Game</button>
                    <button id="leave-room" className="btn btn-danger" onClick={leaveRoom}>Leave Room</button>
                </div>
            </div>
        );
    }
};

function leaveRoom() {
    router.navigateToLobby();
}

const mapStateToProps = (state, ownProps) => ({
    roomUsers: state.roomUsers,
    roomData: state.roomData
});

const mapDispatchToProps = dispatch => {
    return {
        getRoomDetails: roomId => {
            dispatch(getRoomDetails(roomId));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoomPage);
