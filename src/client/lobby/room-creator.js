import React, { Component } from 'react';

import config from '../config/config';

export default class RoomCreator extends Component {
    render() {
        return (
            <div className="col-lg-4 text-center">
                <h2>Create Room & Set Username</h2>
                <div className="row">
                    <input type="text" placeholder="Please type your new username"></input>
                    <button className="btn btn-primary">Set Username</button>
                </div>
                <br></br>
                <div className="row">
                    <input type="text" placeholder="Please type new room name"></input>
                    <button className="btn btn-primary">Create Room</button>
                </div>
            </div>
        );
    }
};
