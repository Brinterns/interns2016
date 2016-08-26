var leaderService = require('./leader-service');
var roomDataService = require('./room-data-service');
var parameters = require('../parameters');

function startRoundResetTimer(room) {
    var roundResetTimer = setTimeout(nextRound.bind(null, room), parameters.roundResetTime * 1000);
}

function nextRound(room) {
    leaderService.setNextLeader(room);
    room.data = roomDataService.newRoundData(room.data);
    var nextRoundType = room.data.rounds.shift();
    if(nextRoundType){
        room.messageMembers('nextRoundType', nextRoundType);
        room.messageMembers('resetRound');
        var answeringTimer = setTimeout(function() {
            room.messageMembers('resetFinished');
        }, 2000);
    } else {
        room.messageMembers('gameFinished');
    }
}

module.exports = {
    startRoundResetTimer
};
