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
                <button className="btn" onClick={() => cloakService.messageGetLarge()}
                disabled={this.props.disableLarge}>Large</button>
                <button className="btn" onClick={() => cloakService.messageGetSmall()}>Small</button>
            </div>
        );

        return (
            <div className="col-lg-8 text-center" id="random-number">
                {this.props.randomNumber}
                <div>
                    {this.isLeader() ? numberButtons: null}
                </div>
                <div>
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
    disableLarge: state.game.disableLarge    
});

export default connect(
    mapStateToProps
)(NumbersRound)



