import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserList from '../lobby/user-list';

export class RoomPage extends Component {
    render() {
        return (
            <div className="text-center">
                <h2>{`Room: ${this.props.params.id}`}</h2>
                <UserList users={this.props.roomUsers} />
            </div>
        );
    }
};

const mapStateToProps = (state, ownProps) => ({
    roomUsers: state.roomUsers
});

export default connect(
    mapStateToProps
)(RoomPage);
