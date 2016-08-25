import React, { Component } from 'react';
import { connect } from 'react-redux';

import storageService from '../services/storage-service';

import style from '../common/common.scss'
import gameStyle from './game.scss';

const roundTypes = {
    letters: 'L',
    numbers: 'N'
};

export class RoundResults extends Component {
	componentWillMount(){
		this.setState({
			winners: {},
			plebs: {},
			losers: {},
		})
	}

	componentWillReceiveProps(nextProps) {
		let keys = Object.keys(nextProps.finalAnswers);

        switch(this.props.nextRoundType) {
            case roundTypes.letters:
                this.processLettersRoundResults(keys, nextProps.finalAnswers);
                break;
            case roundTypes.numbers:
                this.processNumbersRoundResults(keys, nextProps.finalAnswers);
                break;
            default:
                break;
        }
	}

    processNumbersRoundResults(keys, finalAnswers) {
        keys.sort((a,b) => {
			return finalAnswers[a].distance - finalAnswers[b].distance;
		});

		let winners = keys.reduce((result, id) => {
			if(finalAnswers[id].distance === finalAnswers[keys[0]].distance && finalAnswers[id].score !== 0)
				result[id] = finalAnswers[id];
			return result;
		}, {});

		let plebs = keys.reduce((result, id) => {
			if(finalAnswers[id].distance !== finalAnswers[keys[0]].distance && finalAnswers[id].score !== 0)
				result[id] = finalAnswers[id];
			return result;
		}, {});

		let losers = keys.reduce((result, id) => {
			if(finalAnswers[id].score === 0 )
				result[id] = finalAnswers[id];
			return result;
		}, {});

		this.setState({
			winners: winners,
			plebs: plebs,
			losers: losers
		});
    }

    processLettersRoundResults(keys, finalAnswers) {
        keys.sort((a,b) => {
			return finalAnswers[b].score - finalAnswers[a].score;
		});

		let winners = keys.reduce((result, id) => {
			if(finalAnswers[id].score === finalAnswers[keys[0]].score && finalAnswers[id].score !== 0)
				result[id] = finalAnswers[id];
			return result;
		}, {});

		let plebs = keys.reduce((result, id) => {
			if(finalAnswers[id].score !== finalAnswers[keys[0]].score && finalAnswers[id].score !== 0)
				result[id] = finalAnswers[id];
			return result;
		}, {});

		let losers = keys.reduce((result, id) => {
			if(finalAnswers[id].score === 0 )
				result[id] = finalAnswers[id];
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
				crown = <i className="fa fa-trophy"></i>;
				break;
			}
			case 'plebs': {
				buttonType = 'info';
				crown = '';
				break;
			}
			case 'losers': {
				buttonType = 'danger';
				crown = <i className="fa fa-internet-explorer"></i>;
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
		            <div className={`col-lg-1 ${gameStyle.resultPointer}`}>
		            	{pointer}
		            </div>
		            <div className={`col-lg-1 ${gameStyle.resultCrown}`}>
		            	{crown}
		            </div>
		            <div className={`col-lg-4 ${gameStyle.resultName}`}>
		            	{data[id].name}
		            </div>
		            <div className={`col-lg-4 ${gameStyle.resultWord}`}>
		            	{data[id].word}
	            	</div>
		            <div className={`col-lg-2 ${gameStyle.resultScore}`}>
	            		{data[id].score}
            		</div>
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
    finalAnswers: state.game.finalAnswers,
    nextRoundType: state.game.nextRoundType,
    bestAnswer: state.game.bestAnswer
});

export default connect(
    mapStateToProps
)(RoundResults);
