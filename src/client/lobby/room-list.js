import React, { Component } from 'react';
import { connect } from 'react-redux';

import router from '../services/routing-service';
import cloakService from '../services/cloak-service';
import storageService from '../services/storage-service';

import lobbyStyle from './lobby.scss';
import style from '../common/common.scss';

import RoomOptions from './room-options';

const ENTER_KEY = 13;

export class RoomList extends Component {
    componentWillMount() {
        this.setState({
            roomname: ''
        });
    }

    createRoom() {
        cloakService.messageCreateRoom({name: this.state.roomname, rounds: this.props.rounds});
    }

    handleRoomname(event) {
        this.setState({
            roomname: event.target.value
        });
    }

    handleEnterPress(event) {
        if(event.which === ENTER_KEY) {
            this.createRoom();
        }
    }

    render() {
        return (
            <div className="col-lg-8 text-center">
                <h2>Rooms</h2>
                 <div className="col-lg-12 text-center">
                    <div className="col-lg-12 list-group">
                        <div className="row">
                            <button className={`fa fa-cog fa-3x btn btn-info ${lobbyStyle['cogs-button']}`}
                            data-toggle="collapse" data-target="#room-options"></button>
                            <input className={lobbyStyle['room-creator-input']} placeholder="Room Name" type="text"
                            onChange={(event) => this.handleRoomname(event)} onKeyDown={event => this.handleEnterPress(event)}/>
                            <button className={`btn btn-success`} id="room-name-button"
                            onClick={() => this.createRoom()}>Start</button>
                        </div>
                        <div id="room-options" className="collapse">
                            <RoomOptions />
                        </div>
                    </div>
                </div>
                <div className='col-lg-12 list-group'>
                    {this.props.roomList.map( room => {
                        if(!room.data.started){
                            return (
                                <button className={`list-group-item list-group-item-warning ${style.space}`} key={room.id}
                                        disabled={room.data.started} onClick={() => joinRoom(room)}>
                                    {room.name}
                                    <span className='badge'>{room.users.length}</span>
                                </button>
                            );
                        }
                    })}
                </div>
            </div>
        )
    }
}

function joinRoom(room) {
    router.navigateToRoom(`${room.id}`);
}


const mapStateToProps = state => ({
    roomList: state.lobby.rooms,
    rounds: {
        letter: state.lobby.letterSlider
    }
});

export default connect(
    mapStateToProps
)(RoomList);
