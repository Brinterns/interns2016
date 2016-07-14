import React, { Component } from 'react';

import router from '../services/routing-service';
import { messageJoinRoom } from '../services/cloak-service';

export default function RoomList(props) {
    return (
        <div className="col-lg-4 text-center">
            <h2>Rooms Available</h2>
            <div className="col-lg-12 pre-scrollable list-group">
                {props.roomList.map( result => {
                    return (
                        <button className={'list-group-item list-group-item-warning space'} key={result.id}
                             onClick={()=>joinRoom({id: result.id, name: result.name})}>
                             {result.name}
                            <span className='badge'>{result.users.length}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function joinRoom(room) {
    router.navigateToRoom(`${room.id}`);
}
