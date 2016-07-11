import React, { Component } from 'react';

import config from '../config/config';

import style from './lobby.scss';

export default function UserList(props) {
    return (
        <div className="col-lg-4 text-center">
            <h2>User List</h2>
            <div className="col-lg-12 pre-scrollable list-group">
                <ul>
                    {props.users.map( result => {
                        return (
                            <li className={`list-group-item list-group-item-success ${style.space}`} key={result.id}>
                                {result.name}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
