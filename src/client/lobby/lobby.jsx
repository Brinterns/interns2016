import React, { Component } from 'react';

export default class Lobby extends Component {
    componentWillMount() {
        cloak.configure({
            // TODO: Add configuration
        });

        cloak.run('http://localhost:8090');
    }

    render() {
        return (
            <h1>Lobby</h1>
        );
    }
};
