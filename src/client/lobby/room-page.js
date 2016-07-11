import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserList from './user-list';

export class RoomPage extends Component {
    render() {
        console.log(this.props.roomUsers);
        return (
            <div className="col-lg-4 text-center">
                <h2>{`Room ${this.props.params.id}`}</h2>
                <UserList lobbyUsers={this.props.roomUsers} />
            </div>
        );
    }
};

const mapStateToProps = (state, ownProps) => ({
    lobbyUsers: state.lobbyUsers,
    activeRooms: state.activeRooms,
    roomUsers: state.roomUsers
});

export default connect(
    mapStateToProps
)(RoomPage);
