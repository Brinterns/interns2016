import React, { Component } from 'react';
import { connect } from 'react-redux';

import style from '../room.scss';
import ÖßҬЯЇX from './ÖßҬЯЇX.jpg';

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
            
            if(!this.refs['dict-corner'].className.includes(style.fadeIn)) {
                this.refs['dict-corner'].className += ' ' + style.fadeIn;
            }
        }
    }

    render() {
        return (
            <div className={`col-lg-12 ${style.dictionaryCorner}`} ref="dict-corner">
                {this.state.bestAnswer.word !== undefined ? 
                    <div className={style.susieSection}>
                        <h2>Dictionary Corner</h2>
                        <img className={style.susie} id="yung-suze" src={ÖßҬЯЇX}/>
                    </div>
                :
                    null
                }
                <div className={style.bubble}>
                    <div id="best-answer-word" className={style.dictionaryCornerWord}>
                        {this.state.bestAnswer.word ?
                            this.state.bestAnswer.word
                        :
                            null
                        }
                    </div>
                    <div id="best-answer-definition" className={style.dictionaryCornerDefinition}>
                        {this.state.bestAnswer.definition ?
                            this.state.bestAnswer.definition
                        :
                            this.state.bestAnswer.error
                        }
                    </div>
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