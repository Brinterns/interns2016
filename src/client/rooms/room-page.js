import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { browserHistory } from 'react-router';

import UserList from '../lobby/user-list';

import style from './room.scss'

export class RoomPage extends Component {
    render() {
        return (
            <div className="text-center">
                <h1>{`Room: ${this.props.params.id}`}</h1>
                <UserList users={this.props.roomUsers} />
                <div className="col-lg-8" >
                    <button className="btn btn-success">Start Game</button>
                    <button className="btn btn-danger" onClick={leaveRoom}>Leave Room</button>
                    <div className={style['game-area']}>GAME AREA</div>
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
