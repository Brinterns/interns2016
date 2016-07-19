import React, { Component } from 'react';

import config from '../config/config';

import style from '../common/common.scss'

export default function UserList(props) {
    let users = sort(props.users);
    return (
        <div className="col-lg-4 text-center">
            <h2>User List</h2>
            <div className="col-lg-12 pre-scrollable list-group">
                <ul>
                    {users.map( result => {
                        return (
                            <li className={`list-group-item list-group-item-success ${style.space}`} key={result.id}>
                                {result.name}
                                {showScore(result.data.score)}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

function showScore(score){
    if(score !== undefined){
        return (
            <span className='badge'>{score}</span>
        );
    }
    return null
}

function sort(users) {
    users.sort((a, b) => {
        let score = 0-(a.data.score-b.data.score);
        if(a.score !== undefined && b.data.score !== undefined && score !== 0)
            return score;
        else
            return a.name.localeCompare(b.name);

    });
    return users;
}