var mockery = require('mockery');

describe('cloak server', function() {
    beforeEach(function() {
        mockery.enable({ useCleanCache: true });
    });

    var cloak;
    var cloakConfig;
    var lobby;
    var user;
    var room;
    var users = ['Raul', 'Jamie'];
    var rooms = ['Room1', 'Room2'];
    var disconnect;
    beforeEach(function() {
        mockery.registerAllowable('./cloak-server');

        cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'getLobby', 'getRooms', 'createRoom', 'getRoom']);
        lobby = jasmine.createSpyObj('lobby', ['getMembers', 'messageMembers', 'removeMember']);
        user = jasmine.createSpyObj('user', ['getRoom', 'message']);
        user.data = {name: "name", id: 0};
        room = jasmine.createSpyObj('room', ['removeMember', 'addMember']);

        cloak.getLobby.and.returnValue(lobby);
        lobby.getMembers.and.returnValue(users);
        cloak.getRooms.and.returnValue(rooms);
        cloak.getRoom.and.returnValue(room);
        user.getRoom.and.returnValue(room);

        cloak.configure.and.callFake(function(_config_) {
            cloakConfig = _config_;
        });
        mockery.registerMock('cloak', cloak);
    });

    afterEach(function() {
        mockery.deregisterAll();
    });

    afterEach(function() {
        mockery.disable();
    });

    it('calls configure', function() {
        require('./cloak-server')({});
        expect(cloak.configure).toHaveBeenCalled();
    });

    it('calls run', function() {
        require('./cloak-server')({});
        expect(cloak.run).toHaveBeenCalled();
    });

    it('newMember: on creating a new member, refreshLobby message sent with correct list of users', function() {
        require('./cloak-server')({});
        cloakConfig.lobby.newMember();
        expect(lobby.messageMembers).toHaveBeenCalledWith('refreshLobby', users);
    });

    it('newMember: on creating a new member, refreshRooms message sent with correct list of rooms', function() {
        require('./cloak-server')({});
        cloakConfig.lobby.newMember();
        expect(lobby.messageMembers).toHaveBeenCalledWith('refreshRooms', rooms);
    });

    it('disconnect: calls room.removeMember with correct user', function() {
        require('./cloak-server')({});
        cloakConfig.clientEvents.disconnect(user);
        expect(room.removeMember).toHaveBeenCalledWith(user);
    });

    it('disconnect: calls getLobby.removeMember with correct user', function() {
        require('./cloak-server')({});
        cloakConfig.clientEvents.disconnect(user);
        expect(lobby.removeMember).toHaveBeenCalledWith(user);
    });

    it('setUserUp: updates user correctly', function() {
        require('./cloak-server')({});
        cloakConfig.messages.setUserUp("", user);
        var userData = {name: user.name, id: user.id};
        expect(userData).toEqual(user.data);
    });

    it('setUsername: sets user.name to the passed argument', function() {
        require('./cloak-server')({});
        cloakConfig.messages.setUsername('TEST_USERNAME', user);
        expect(user.name).toEqual('TEST_USERNAME');
    });

    it('setUserUp: sends updateData message', function() {
        require('./cloak-server')({});
        cloakConfig.messages.setUserUp("", user);
        var userData = {name: user.name, id: user.id};
        expect(user.message).toHaveBeenCalledWith('updateData', user.data);
    });

    it('createRoom: creates room with the passed argument', function() {
        require('./cloak-server')({});
        cloakConfig.messages.createRoom('TEST_ROOM_NAME', user);
        expect(cloak.createRoom).toHaveBeenCalledWith('TEST_ROOM_NAME');
    });

    it('joinRoom: finds the room that has the ID passed as argument', function() {
        require('./cloak-server')({});
        cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);
        expect(cloak.getRoom).toHaveBeenCalledWith('TEST_ROOM_ID');
    });

    it('joinRoom: makes the current user join the room with the correct ID', function() {
        require('./cloak-server')({});
        cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);
        expect(room.addMember).toHaveBeenCalledWith(user);
    });

});
