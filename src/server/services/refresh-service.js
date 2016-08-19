function refreshRoomUsers(room) {
    var users = room.getMembers();
    for(var i=0; i < users.length; i++) {
        users[i].data.score = room.data.scores[users[i].id];
        users[i] = {
            id: users[i].id,
            name: users[i].name,
            data: users[i].data
        };
    }
    room.messageMembers('refreshRoomUsers', users);
}


module.exports = {
    refreshRoomUsers
};
