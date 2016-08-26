import React, { Component } from 'react';
import { connect } from 'react-redux';

import router from '../services/routing-service';
import cloakService from '../services/cloak-service';

import UserList from '../user/user-list';
import Game from '../game/game';
import Progress from '../game/progress';
import NumbersRound from '../game/numbers-round';

import { leaveGame } from '../game/game-actions';
import storageService from '../services/storage-service';

import style from './room.scss';

const roundTypes = {
    letters: 'L',
    numbers: 'N'
};

export class RoomPage extends Component {
    componentWillMount() {
        if(cloakService.isConnected()) {
            cloakService.messageJoinRoom(this.props.params.data);
            cloakService.getRoomData(this.props.params.data);
        } else {
            cloakService.configureAndRun(this.props.params.data);
        }
    }

    componentWillUnmount() {
        if(cloakService.isConnected()) {
            this.props.leaveGame();
            cloakService.messageRemoveFromRoomList(this.props.params.data);
            cloakService.messageLeaveRoom();
        }
    }

    render() {
        let round;
        switch (this.props.nextRoundType) {
            case roundTypes.letters: {
                round = <Game />
                break;
            }
            case roundTypes.numbers: {
                round = <NumbersRound />
                break;
            }
            default: {
                round = <Game />
                break;
            }
        }

        return (
            <div className="text-center">
                <Progress/>
                <div>
                    <h1>{`Room: ${this.props.roomData.name}`}</h1>
                    <div className={`col-lg-12 ${style.roomCreator}`}>
                        {!this.props.started ? 
                            `Room Creator: ${this.props.roomData.data.creator.name}`
                        :
                            null
                        }
                    </div>
                    <UserList users={this.props.roomUsers} />
                    <div className="col-lg-8" >
                        <button className={`btn ${style.startGame}`} id="start-game" disabled={this.props.disableStart}
                                onClick={() => {cloakService.messageStartGame()}}>Start</button>
                            <button className={`btn  ${style.leaveGame}`} id="leave-room"
                                onClick={leaveRoom}>Leave</button>
                    </div>
                    {this.props.started ?
                        round
                    :
                        null
                    }
                </div>
            </div>
        );
    }
};

function leaveRoom() {
    router.navigateToLobby();
}

const mapStateToProps = (state, ownProps) => ({
    roomUsers: state.room.users,
    roomData: state.room.room,
    started: state.game.started,
    disableStart: state.game.disableStart,
    nextRoundType: state.game.nextRoundType
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
