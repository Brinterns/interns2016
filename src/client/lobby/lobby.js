import React, { Component } from 'react';

import config from '../config/config';

export default class Lobby extends Component {
    componentWillMount() {
        cloak.configure({
            // TODO: Add configuration
        });

        cloak.run(config.cloakAddress);
    }

    render() {
        return (
            <h1>Lobby</h1>
        );
    }
};
