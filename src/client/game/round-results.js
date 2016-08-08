import React, { Component } from 'react';
import { connect } from 'react-redux';

import style from '../common/common.scss'

export class RoundResults extends Component {
	render() {
		const finalAnswersData = Object.keys(this.props.finalAnswers).map(id => {
			return(
		        <li className={`list-group-item list-group-item-success ${style.space}`}>
		            {this.props.finalAnswers[id].name + ' ' +
		             this.props.finalAnswers[id].word + ' ' + 
		             this.props.finalAnswers[id].score}
		        </li>
			)
		});

		return	(
			<div>{finalAnswersData}</div> 
		);
	}
}


const mapStateToProps = state => ({
    finalAnswers: state.game.finalAnswers
});

export default connect(
    mapStateToProps
)(RoundResults);