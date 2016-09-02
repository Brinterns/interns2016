var parameters = require('../parameters');

function startAnswering(room) {
    room.data.answerTime = parameters.conundrumTime;
    room.data.answering = true;
    room.messageMembers('startAnswering', parameters.conundrumTime);
    var timeLeft = setInterval(answerTimeTick.bind(null, room), 1000);
    var answeringTimer = setTimeout(answeringFinished.bind(null, room, timeLeft), parameters.conundrumTime*1000);
}

function answeringFinished(room, timeLeft) {
    room.messageMembers('stopAnswering');
    room.data.answering = false;
    clearInterval(timeLeft);
    startSubmission(room);
}

function answerTimeTick(room) {
    room.data.answerTime--;
}

function submitAnagram(anagram, user) {

}

module.exports = {
    startAnswering
};
