import React, { Component } from 'react';

import config from '../config/config';

import style from './lobby.scss';

export default function UserList(props) {
    return (
        <div className="col-lg-4 text-center">
            <h2>User List</h2>
            <div className={style['list-areas']}>
                {props.lobbyUsers.map( result => {
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
