import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { browserHistory } from 'react-router';

import UserList from '../lobby/user-list';

export class RoomPage extends Component {
    render() {
        return (
            <div className="text-center">
                <h2>{`Room: ${this.props.params.id}`}</h2>
                <UserList users={this.props.roomUsers} />
                <div>
                    <button onClick={leaveRoom}>Leave Room</button>
                </div>

            </div>
        );
    }
};

function leaveRoom(){
    browserHistory.push('/');
    cloak.message('leaveRoom');
}

const mapStateToProps = (state, ownProps) => ({
    roomUsers: state.roomUsers
});

export default connect(
    mapStateToProps
)(RoomPage);
