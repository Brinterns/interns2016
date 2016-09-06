import React, { Component } from 'react';

export default class FinalScores extends Component {
    render() {
        const users = this.props.users.map(user => {
            return (
                <li>
                    Name: {user.name} Score: {user.data.score}
                </li>
            )
        });
        return(
            <div>
                {users}
            </div>
        )
    }
}