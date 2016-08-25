import React, { Component } from 'react';
import { connect } from 'react-redux';

export class DictionaryCorner extends Component {
    componentWillMount() {
        this.setState({
            bestAnswer: {}
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.bestAnswer) {
            this.setState({
                bestAnswer: nextProps.bestAnswer
            });
        }
    }

    render() {
        return (
            <div className="col-lg-12">
                <h2>Fakkin SUSIE comin at ya</h2>
                <div>
                    {this.state.bestAnswer.word ?
                        'CHECK dis word fam: ' + this.state.bestAnswer.word
                    :
                        null
                    }
                </div>
                <div>
                    {this.state.bestAnswer.definition ?
                        'WHAT u kno about definitions blad: ' + this.state.bestAnswer.definition
                    :
                        null
                    }
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    bestAnswer: state.game.bestAnswer
});

export default connect(
    mapStateToProps
)(DictionaryCorner);