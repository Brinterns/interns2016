import React, { Component } from 'react';
import { connect } from 'react-redux';

import style from './room.scss';

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
    
            this.refs['dict-corner'].className += ' ' + style['fadein'];
        }

    }

    render() {
        return (
            <div className={`col-lg-12 ${style['dictionary-corner']}`} ref="dict-corner">
                {this.state.bestAnswer.word !== undefined ? 
                    <h2>Dictionary Corner</h2>
                :
                    null
                }
                <div className={style['dictionary-corner-word']}>
                    {this.state.bestAnswer.word ?
                        this.state.bestAnswer.word
                    :
                        null
                    }
                </div>
                <div className={style['dictionary-corner-definition']}>
                    {this.state.bestAnswer.definition ?
                        this.state.bestAnswer.definition
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