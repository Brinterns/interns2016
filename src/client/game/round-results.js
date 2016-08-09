import React, { Component } from 'react';
import { connect } from 'react-redux';

import storageService from '../services/storage-service';

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
			return nextProps.finalAnswers[a].score - nextProps.finalAnswers[b].score;
			// if (nextProps.finalAnswers[a].score < nextProps.finalAnswers[b].score)
	  //   		return -1;
	  // 		if (nextProps.finalAnswers[a].score > nextProps.finalAnswers[b].score)
	  //   		return 1;
			// return 0;
		});

		sortedKeys.reverse();

		let winners = sortedKeys.reduce((result, id) => {
			if(nextProps.finalAnswers[id].score === nextProps.finalAnswers[sortedKeys[0]].score)
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
	}

	listElem(data, type) {
		let buttonType;
		let crown;
		let userId = storageService.getUser().id;

		switch (type) {
			case 'winners': {
				buttonType = 'success';
				crown = '\u265A';
				break;
			}
			case 'plebs': {
				buttonType = 'info';
				crown = '  ';
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
			let pointer = '   ';
			id === userId ? pointer = 'YOU' : null;
			return(
		        <li className={`list-group-item list-group-item-${buttonType} ${style.space}`}>
		            <div className={`col-lg-1`}>{pointer}</div>
		            <div className={`col-lg-1 ${gameStyle['result-crown']}`}>{crown}</div>
		            <div className={`col-lg-4 ${gameStyle['result-name']}`}>{data[id].name}</div>
		            <div className={`col-lg-4`}>{data[id].word}</div>
		            <div className={`col-lg-2`}>{data[id].score}</div>
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