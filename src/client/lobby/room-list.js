import React, { Component } from 'react';

import config from '../config/config';

import style from './lobby.scss';

export default function RoomList(props) {
    return (
        <div className="col-lg-4 text-center">
            <h2>Rooms Available</h2>
            <div className={`pre-scrollable ${style['list-areas']}`}>
                {props.roomList.map( result => {
                    return (
                        <p className='row' key={result['id']}>
                            {result['name']}
                        </p>
                    );
                })}
            </div>
        </div>
    );
}
