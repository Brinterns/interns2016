import React, { Component } from 'react';

import router from '../services/routing-service';
import { messageJoinRoom } from '../services/cloak-service';
import { setRoom } from '../services/storage-service';

export default function RoomList(props) {
    return (
        <div className="col-lg-4 text-center">
            <h2>Rooms Available</h2>
            <div className="col-lg-12 pre-scrollable list-group">
                {props.roomList.map( result => {
                    return (
                        <button className={getClass(result)} key={result.id} 
                             disabled={result.data.started} onClick={()=>joinRoom(result)}>
                             {result.name}
                            <span className='badge'>{result.users.length}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function getClass(room) {
    if(room.data.started){
        return 'list-group-item list-group-item-danger space';
    }
    else{
        return 'list-group-item list-group-item-warning space';
    }
}

function joinRoom(room) {
    setRoom(JSON.stringify(room));
    router.navigateToRoom(`${room.id}`);
}
