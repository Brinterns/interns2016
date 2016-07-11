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


    beforeEach(function() {
        require('./cloak-server')({});
    });

    afterEach(function() {
        mockery.deregisterAll();
    });

    afterEach(function() {
        mockery.disable();
    });

    it('calls configure', function() {
        expect(cloak.configure).toHaveBeenCalled();
    });

    it('calls run', function() {
        expect(cloak.run).toHaveBeenCalled();
    });

    describe('newMember', () => {
        it('on creating a new member, refreshLobby message sent with correct list of users', function() {
            cloakConfig.lobby.newMember();
            expect(lobby.messageMembers).toHaveBeenCalledWith('refreshLobby', users);
        });

        it('on creating a new member, refreshRooms message sent with correct list of rooms', function() {
            cloakConfig.lobby.newMember();
            expect(lobby.messageMembers).toHaveBeenCalledWith('refreshRooms', rooms);
        });
    });

    describe('disconnect', () => {
        it('disconnect: calls room.removeMember with correct user', function() {
            cloakConfig.clientEvents.disconnect(user);
            expect(room.removeMember).toHaveBeenCalledWith(user);
        });

        it('disconnect: calls getLobby.removeMember with correct user', function() {
            cloakConfig.clientEvents.disconnect(user);
            expect(lobby.removeMember).toHaveBeenCalledWith(user);
        });
    });

    describe('setUserUp', () => {
        it('setUserUp: updates user correctly', function() {
            cloakConfig.messages.setUserUp("", user);
            var userData = {name: user.name, id: user.id};
            expect(userData).toEqual(user.data);
        });

        it('setUserUp: sends updateData message', function() {
            cloakConfig.messages.setUserUp("", user);
            var userData = {name: user.name, id: user.id};
            expect(user.message).toHaveBeenCalledWith('updateData', user.data);
        });
    });

    it('setUsername: sets user.name to the passed argument', function() {
        cloakConfig.messages.setUsername('TEST_USERNAME', user);
        expect(user.name).toEqual('TEST_USERNAME');
    });


    it('createRoom: creates room with the passed argument', function() {
        cloakConfig.messages.createRoom('TEST_ROOM_NAME', user);
        expect(cloak.createRoom).toHaveBeenCalledWith('TEST_ROOM_NAME');
    });

    describe('joinRoom', () => {
        it('joinRoom: finds the room that has the ID passed as argument', function() {
            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);
            expect(cloak.getRoom).toHaveBeenCalledWith('TEST_ROOM_ID');
        });

        it('joinRoom: makes the current user join the room with the correct ID', function() {
            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);
            expect(room.addMember).toHaveBeenCalledWith(user);
        });
    });

});
