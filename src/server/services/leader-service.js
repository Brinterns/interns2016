function makeLeader(leaderIndex, room) {
    if(!room.data.started){
        return;
    }
    var roomMembers = room.getMembers();
    var lettersRound = room.data.lettersRound;
    var leader = {
        id: 1,
        name: 'God',
    };
    if(roomMembers.length !== 0) {
        leader = {
            id: roomMembers[leaderIndex].id,
            name: roomMembers[leaderIndex].name,
            data: roomMembers[leaderIndex].data,
            disableConsonant: lettersRound.disableConsonant,
            disableVowel: lettersRound.disableVowel
        }
    }
    room.messageMembers('setLeader', leader);
}

function setNextLeader(room) {
    var members = room.getMembers();
    if(members.length === 0)
        return;
    var nextLeader = room.data.leaderIndex;
    nextLeader++;
    nextLeader = nextLeader >= members.length ? 0 : nextLeader;
    makeLeader(nextLeader, room);
    room.data.leaderIndex = nextLeader;
    room.data.leaderId = members[nextLeader].id;
}

module.exports = {
    setNextLeader,
    makeLeader
}
