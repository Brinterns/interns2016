import React, { Component } from 'react';
import { connect } from 'react-redux';

import cloakService from '../services/cloak-service';
import storageService from '../services/storage-service';

export class NumbersRound extends Component {
    componentWillMount() {
        cloakService.messageGetRandomNumber();
    }

    isLeader() {
        let userId = storageService.getUser().id;
        if(userId === this.props.leader.id) {
            return true;
        }
        return false;
    }

    render() {
        const numberButtons = (
            <div>
                <button className="btn" id="get-large" onClick={() => cloakService.messageGetLarge()}
                disabled={this.props.disableLarge}>Large</button>
                <button className="btn" id="get-small" onClick={() => cloakService.messageGetSmall()}
                disabled={this.props.disableSmall}>Small</button>
            </div>
        );

        return (
            <div>
                <div className="col-lg-8 text-center" id="random-number">
                    {this.props.randomNumber}
                </div>
                <div>
                    {this.isLeader() ? numberButtons: null}
                </div>
                <div id="number-list">
                    {this.props.numberList}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    leader: state.game.leader,
    numberList: state.game.numberList,
    randomNumber: state.game.randomNumber,
    disableLarge: state.game.disableLarge,
    disableSmall: state.game.disableSmall
});

export default connect(
    mapStateToProps
)(NumbersRound)
