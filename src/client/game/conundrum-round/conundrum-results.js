import React, { Component } from 'react';
import { connect } from 'react-redux';

import style from '../game.scss';

export class ConundrumResults extends Component {

    render() {
        const name = this.props.conundrumResults.winner !== undefined ? this.props.conundrumResults.winner.name : null;
        return (
            <div className="col-lg-12 text-center">
                {name + ' ' + this.props.conundrumResults.solution}    
            </div>
        );
    }
}

const mapStateToProps = state => ({
    conundrumResults: state.game.conundrumResults
});

export default connect(
    mapStateToProps
)(ConundrumResults)