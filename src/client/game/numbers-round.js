import React, { Component } from 'react';
import { connect } from 'react-redux';

import cloakService from '../services/cloak-service';

export class NumbersRound extends Component {
    componentWillMount() {
        cloakService.messageGetRandomNumber();
    }    

    render() {
        return (
            <div className="col-lg-8 text-center">
                {this.props.randomNumber}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    randomNumber: state.game.randomNumber    
});

export default connect(
    mapStateToProps
)(NumbersRound)



