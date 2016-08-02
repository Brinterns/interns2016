import React, { Component } from 'react';

import router from '../services/routing-service';

import style from '../common/common.scss';

export default function RoomList(props) {
    return (
        <div className="col-lg-4 text-center">
            <h2>Rooms Available</h2>
            <div className="col-lg-12 pre-scrollable list-group">
                {props.roomList.map( room => {
                    return (
                        <button className={`list-group-item list-group-item-${getColour(room)} ${style.space}`} key={room.id}
                                disabled={room.data.started} onClick={()=>joinRoom(room)}>
                            {room.name}
                            <span className='badge'>{room.users.length}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function getColour(room) {
    if(room.data.started){
        return 'danger';
    }
    else{
        return 'warning';
    }
}

function joinRoom(room) {
    router.navigateToRoom(`${room.id}`);
}
