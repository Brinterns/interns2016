import React, { Component } from 'react';
import { connect } from 'react-redux';

import style from '../common/common.scss'
import gameStyle from './game.scss';

export class RoundResults extends Component {
	componentWillMount(){
		this.setState({
			winners: {},
			plebs: {},
			losers: {}
		})
	}

	componentWillReceiveProps(nextProps) {
		let sortedKeys = Object.keys(nextProps.finalAnswers);
		sortedKeys.sort((a,b) => {
			nextProps.finalAnswers[a].score - nextProps.finalAnswers[b].score
		});

		let winners = sortedKeys.reduce((result, id) => {
			if(nextProps.finalAnswers[id].score === nextProps.finalAnswers[sortedKeys[0]].score && nextProps.finalAnswers[id].score !== 0)
				result[id] = nextProps.finalAnswers[id];
			return result;
		}, {});

		let plebs = sortedKeys.reduce((result, id) => {
			if(nextProps.finalAnswers[id].score !== nextProps.finalAnswers[sortedKeys[0]].score && nextProps.finalAnswers[id].score !== 0)
				result[id] = nextProps.finalAnswers[id];
			return result;
		}, {});

		let losers = sortedKeys.reduce((result, id) => {
			if(nextProps.finalAnswers[id].score === 0 )
				result[id] = nextProps.finalAnswers[id];
			return result;
		}, {});

		this.setState({
			winners: winners,
			plebs: plebs,
			losers: losers
		});

		console.log(winners);
		console.log(plebs);
		console.log(losers);
	}

	listElem(data, type) {
		let buttonType;
		let crown;
		switch (type) {
			case 'winners': {
				buttonType = 'success';
				crown = '\u265A';
				break;
			}
			case 'plebs': {
				buttonType = 'info';
				crown = '\u262D';
				break;
			}
			case 'losers': {
				buttonType = 'danger';
				crown = '\u262D';
				break;
			}
			default: {
				buttonType = 'info';
				crown = '\u262D';
			}
		}

		return Object.keys(data).map(id => {
			return(
		        <li className={`list-group-item list-group-item-${buttonType} ${style.space}`}>
		            <div className={`col-lg-4 ${gameStyle['result-name']}`}>{data[id].name + ' ' + crown}</div>
		            <div className={`col-lg-4`}>{data[id].word}</div>
		            <div className={`col-lg-4`}>{data[id].score}</div>
		        </li>
			)
		});
	}

	render() {
		const winnersData = this.listElem(this.state.winners, 'winners');
		const plebsData = this.listElem(this.state.plebs, 'plebs');
		const losersData = this.listElem(this.state.losers, 'losers');
		return	(
			<div>
				{winnersData}
				<br></br>
				{plebsData}
				<br></br>
				{losersData}
			</div> 
		);
	}
}


const mapStateToProps = state => ({
    finalAnswers: state.game.finalAnswers
});

export default connect(
    mapStateToProps
)(RoundResults);