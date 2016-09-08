import React, { Component } from 'react';

import style from '../room.scss';

import First from './GOLDTPOT.jpg';
import Second from './SILVERTPOT.jpg'; 
import Third from './BRONZETPOT.jpg'; 
import Loser from './T-BAG.jpg';

export default class FinalScores extends Component {
    sortByScore(users) {
        return users.sort((a, b) => {
            return (b.data.score - a.data.score);
        });
    }

    getWinners() {
        let sortedUsers = this.sortByScore(this.props.users);
        const winners = [];

        for(let i=0; i<3; i++) {
            if(sortedUsers[i] !== undefined) {
                winners.push({ name: sortedUsers[i].name, score: sortedUsers[i].data.score });
            }
        }

        return winners;
    }

    getLoser() {
        let sortedUsers = this.sortByScore(this.props.users);
        let loser = sortedUsers[sortedUsers.length - 1];
        if(sortedUsers.length > 3){
            return ({ name: loser.name, score: loser.data.score });
        }
    }

    render() {
        const winners = this.getWinners();
        const loser = this.getLoser();
        return(
            <div>
                <h2> Final Scores </h2> 
                <div>
                    <li className={`list-group-item ${style.listItem}`}>
                        <div className={`col-lg-4 ${style.data}`}>
                            <span className={style.name}>{winners[0].name}</span>
                            <span>{winners[0].score}</span>
                        </div>
                        <div className={`col-lg-4 ${style.image}`}>
                            <img className={style.teapots} src={First} />
                        </div>
                    </li>
                    <br />
                    <li className={`list-group-item ${style.listItem}`}>
                        <div className={`col-lg-4 ${style.data}`}>
                            <span className={style.name}>{winners[1].name}</span>
                            <span>{winners[1].score}</span>
                        </div>
                        <div className={`col-lg-4 ${style.image}`}>
                            <img className={style.teapots} src={Second} />
                        </div>
                    </li>
                    <br />
                    {this.props.users[2] ? 
                        <li className={`list-group-item ${style.listItem}`}>
                            <div className={`col-lg-4 ${style.data}`}>
                                <span className={style.name}>{winners[2].name}</span>
                                <span>{winners[2].score}</span>
                            </div>
                            <div className={`col-lg-4 ${style.image}`}>
                                <img className={style.teapots} src={Third} />
                            </div>
                        </li>
                    : null}
                    <br />
                    {loser !== undefined ? 
                        <li className={`list-group-item ${style.listItem}`}>
                            <div className={`col-lg-4 ${style.loserData}`}>
                                <span className={style.name}>{loser.name}</span>
                                <span>{loser.score}</span>
                            </div>
                            <div className={`col-lg-4 ${style.image}`}>
                                <img className={style.teapots} src={Loser} />
                            </div>
                        </li>
                    : null}
                </div>
            </div>
        )
    }
}