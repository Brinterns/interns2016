import React, { Component } from 'react';

import config from '../config/config';

import style from '../common/common.scss'

export default function UserList({ users }) {
    let sortedUsers = sort(users);
    const userItems = sortedUsers.map(user => (
        <li className={`list-group-item list-group-item-success ${style.space}`} key={user.id}>
            {user.name}
            {showScore(user.data.score)}
        </li>
    ));

    return (
        <div className="col-lg-4 text-center">
            <h2>User List</h2>
            <div className="col-lg-12 pre-scrollable list-group">
                <ul>{userItems}</ul>
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
    users = Array.from(users);
    users.sort((user1, user2) => {
        let score = 0-(user1.data.score-user2.data.score);
        if(user1.data.score !== undefined && user2.data.score !== undefined && score !== 0) {
            return score;
        }

        return user1.name.localeCompare(user2.name);
    });

    return users;
}
