import React, { Component } from 'react';
import { connect } from 'react-redux';

import router from '../services/routing-service';
import { messageLeaveRoom, messageJoinRoom, isConnected } from '../services/cloak-service';

import UserList from '../user/user-list';

export class RoomPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            roomData: []
        };
    }
    componentWillMount() {
        if(isConnected()) {
            var data = this.props.params.data;
            var id = data.slice(0, data.indexOf('&'));
            var name = data.substring(data.indexOf('&')+1);
            this.setState({
                roomData: [id, name]
            }, () => {
                messageJoinRoom(this.state.roomData[0]);
            });
        } else {
            router.navigateToLobby();
        }
    }

    render() {
        return (
            <div className="text-center">
                <h1>{`Room: ${this.state.roomData[1]}`}</h1>
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
