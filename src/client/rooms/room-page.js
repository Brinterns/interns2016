import React, { Component } from 'react';

export default class RoomPage extends Component {
    render() {
        return (
            <div className="col-lg-4 text-center">
            <h2>{`Room: ${this.props.params.id}`}</h2>
            </div>
        );
    }
};
