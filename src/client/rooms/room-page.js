import React, { Component } from 'react';
import { connect } from 'react-redux';

import router from '../services/routing-service';
import { messageLeaveRoom } from '../services/cloak-service';

import UserList from '../lobby/user-list';

export class RoomPage extends Component {
    render() {
        return (
            <div className="text-center">
                <h1>{`Room: ${this.props.params.id}`}</h1>
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
    messageLeaveRoom();
    router.navigateToLobby();
}

const mapStateToProps = (state, ownProps) => ({
    roomUsers: state.roomUsers
});

export default connect(
    mapStateToProps
)(RoomPage);
