var mockery = require('mockery');

var cloak;
var cloakConfig;
var lobby;
var user;
var room;
var users;
var rooms;
var disconnect;

describe('cloak server', function() {
    var randomConsonant;
    var randomVowel;
    beforeEach(function() {
        randomConsonant = jasmine.createSpy('randomConsonant');
        randomVowel = jasmine.createSpy('randomVowel');
    });

    beforeEach(function() {
        mockery.enable({ useCleanCache: true });
    });

    beforeEach(function() {
        mockery.registerMock('./random-consonant-picker', randomConsonant);
        mockery.registerAllowable('./cloak-server');
        mockery.registerAllowable('./letter-lists');
        mockery.registerMock('./random-vowel-picker', randomVowel);
        mockery.registerAllowable('./game-parameters');
    });

    beforeEach(function() {
        cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'getLobby', 'getRooms', 'createRoom', 'getRoom']);
        lobby = jasmine.createSpyObj('lobby', ['getMembers', 'messageMembers', 'removeMember']);
        user = jasmine.createSpyObj('user', ['getRoom', 'message']);
        room = jasmine.createSpyObj('room', ['removeMember', 'addMember', 'messageMembers', 'getMembers']);
    });

    beforeEach(function() {
        cloak.getLobby.and.returnValue(lobby);

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

    describe('cloak setup tests', () => {
        it('calls configure', function() {
            expect(cloak.configure).toHaveBeenCalled();
        });

        it('calls run', function() {
            expect(cloak.run).toHaveBeenCalled();
        });
    });

    describe('newMember', () => {
        it('on creating a new member, refreshLobby message sent with correct list of users', function() {
            users = ['Raul', 'Jamie'];
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            lobby.getMembers.and.returnValue(users);

            cloakConfig.lobby.newMember();

            expect(lobby.messageMembers).toHaveBeenCalledWith('refreshLobby', users);
        });

        it('on creating a new member, refreshRooms message sent with correct list of rooms', function() {
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});      
            lobby.getMembers.and.returnValue(users);

            cloakConfig.lobby.newMember();

            expect(lobby.messageMembers).toHaveBeenCalledWith('refreshRooms', rooms);
        });
    });

    describe('setUserUp', () => {
        it('updates user correctly', function() {
            user.data = {name: "name", id: 0};
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.setUserUp("", user);
            var userData = {name: user.name, id: user.id};

            expect(userData).toEqual(user.data);
        });

        it('sends updateData message', function() {
            user.data = {name: "name", id: 0};
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.setUserUp("", user);
            var userData = {name: user.name, id: user.id};

            expect(user.message).toHaveBeenCalledWith('updateData', user.data);
        });
    });

    it('setUsername: sets user.name to the passed argument', function() {
        user.data = {name: "name", id: 0};
        lobby.getMembers.and.returnValue([]);

        cloakConfig.messages.setUsername('TEST_USERNAME', user);

        expect(user.name).toEqual('TEST_USERNAME');
    });


    describe('createRoom', () => {
        it('creates room with the passed argument', function() {
            user = {name: "name", id: 0};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue({data:{creator:''}});

            cloakConfig.messages.createRoom('TEST_ROOM_NAME', user);
            expect(cloak.createRoom).toHaveBeenCalledWith('TEST_ROOM_NAME');
        });

        it('updates creator', function() {
            user = {name: "name", id: "12345-abcde"};
            room = {name: "Room 1",data:{creator:{id:'sa',name:'sa'}}};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue(room);
 
            cloakConfig.messages.createRoom('TEST_ROOM_NAME', user);

            expect(room.data.creator).toEqual(user);
        });

        it('sets room to not started on creation', function() {
            user = {name: "name", id: "12345-abcde"};
            room = {name: "Room 1",data:{creator:{id:'sa',name:'sa'}}};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue(room);
 
            cloakConfig.messages.createRoom('TEST_ROOM_NAME', user);

            expect(room.data.started).toEqual(false);
        });
    });

    describe('joinRoom', () => {
        it('finds the room that has the ID passed as argument', function() {
            user.data = {name: "name", id: 0};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue(room);
            room.data = {userIdList: []};
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);

            expect(cloak.getRoom).toHaveBeenCalledWith('TEST_ROOM_ID');
        });

        it('makes the current user join the room with the correct ID', function() {
            user.data = {name: "name", id: 0};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue(room);
            room.data = {userIdList: []};
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);

            expect(room.addMember).toHaveBeenCalledWith(user);
        });

        it('sets the score of the current user to 0', function() {
            user.data = {name: "name", id: 0};
            rooms = [{id:'1'}];
            room.data = {userIdList: []};
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue(room);
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);
            
            expect(user.data.score).toEqual(0);
        });
    });

    describe('refreshRoomUsers ', () => {
        it('the members of the correct room are retrieved', function() {
            room.getMembers.and.returnValue([]);
            room.data = {};

            cloakConfig.room.newMember.bind(room,'')();

            expect(room.getMembers).toHaveBeenCalled();
        });
    });

    describe('leaveRoom ', () => {
        it('the correct room is retrieved for the user', function() {
            user.getRoom.and.returnValue(room);
            user.data = {score: 0};
            room.data = {
                leaderIndex: 0
            };
            room.getMembers.and.returnValue(['', user]);

            cloakConfig.messages.leaveRoom('', user);

            expect(user.getRoom).toHaveBeenCalled();
        });
        it('the correct user is removed from the room', function() {
            user.getRoom.and.returnValue(room);
            user.data = {score: 0};
            room.data = {
                leaderIndex: 0
            };
            room.getMembers.and.returnValue(['', user]);
            
            cloakConfig.messages.leaveRoom('', user);

            expect(room.removeMember).toHaveBeenCalledWith(user);
        })
        it('sets the score of the user user that is removed from the room to undefined', function() {
            user.getRoom.and.returnValue(room);
            user.data = {score: 0};
            room.data = {
                leaderIndex: 0
            };
            room.getMembers.and.returnValue(['', user]);
            
            cloakConfig.messages.leaveRoom('', user);

            expect(user.data.score).toEqual(undefined);
        })
    });

    describe('roomDetails ', () => {
        it('retrieves the correct room from the server', function() {
            let roomDetails = {id: 1, name: 'Room 1', data:{started: false}};
            cloak.getRoom.and.returnValue(roomDetails);

            cloakConfig.messages.roomDetails(1, user);

            expect(user.message).toHaveBeenCalledWith('roomDetailsResponse', roomDetails);
        })
    });

    describe('startGame ', () => {
        it('retrieves the correct room ', function() {
            user.getRoom.and.returnValue(room);
            room.getMembers.and.returnValue([user]);
            room.data = {
                leaderIndex: '',
                started: false,
                letterList: {
                    disableConsonant: false,
                    disableVowel: true
                }
            };
            cloak.getRooms.and.returnValue([]);

            cloakConfig.messages.startGame('', user);

            expect(user.getRoom).toHaveBeenCalled();
        })

        it('finds the index of the correct user in the room', function() {
            user.getRoom.and.returnValue(room);
            room.getMembers.and.returnValue([user]);
            room.data = {
                leaderIndex: '',
                started: false,
                letterList: {
                    disableConsonant: false,
                    disableVowel: true
                }
            };
            cloak.getRooms.and.returnValue([]);

            cloakConfig.messages.startGame('', user);

            expect(room.data).toEqual({
                    leaderIndex: 0, 
                    started: true,
                    letterList: {
                        disableConsonant: false,
                        disableVowel: true
                    }
            });
        })

        it('calls setLeader with correct room', function() {
            user.getRoom.and.returnValue(room);
            user.id = '1';
            user.name = 'User 1';
            user.data = '';
            room.getMembers.and.returnValue([user]);
            room.data = {
                leaderIndex: '',
                started: false,
                letterList: {
                    disableConsonant: false,
                    disableVowel: true
                }
            };
            cloak.getRooms.and.returnValue([]);

            cloakConfig.messages.startGame('', user);

            var expectedLeader = {
                id: user.id,
                name: user.name,
                data: user.data,
                disableConsonant: false,
                disableVowel: true
            }
            expect(room.messageMembers).toHaveBeenCalledWith('setLeader', expectedLeader);
        })

        it('updates the leader index of the correct user in the room', function() {
            user.getRoom.and.returnValue(room);
            room.getMembers.and.returnValue(['',user]);
            room.data = {
                leaderIndex: '',
                started: false,
                letterList: {
                    disableConsonant: false,
                    disableVowel: true
                }
            };
            cloak.getRooms.and.returnValue([]);

            cloakConfig.messages.startGame('', user);

            expect(room.data.leaderIndex).toEqual(1);
        })
    });
    describe('getConsonant', () => {
        it('sends disableConsonant if there are 6 or more consonants', function(){
            user.getRoom.and.returnValue(room);
            room.data = {
                letterList: {
                    letters: [],
                    consonantNum: 7
                }
            }
            cloakConfig.messages.getConsonant('', user);

            expect(user.message).toHaveBeenCalledWith('disableConsonant', true);
        });

        it('sends updateConsonant if there are less than 6 consonants', function(){
            let rndConsonant = 'F';
            randomConsonant.and.returnValue(rndConsonant);

            user.getRoom.and.returnValue(room);
            room.data = {
                letterList: {
                    letters: [],
                    consonantNum: 3
                }
            }
            cloakConfig.messages.getConsonant('', user);

            expect(room.messageMembers).toHaveBeenCalledWith('updateConsonant', rndConsonant);
        });
    });

    describe('getVowel', () => {
        it('sends disableVowel if there are 5 or more vowels', function(){
            user.getRoom.and.returnValue(room);
            room.data = {
                letterList: {
                    letters: [],
                    vowelNum: 6
                }
            }
            cloakConfig.messages.getVowel('', user);

            expect(user.message).toHaveBeenCalledWith('disableVowel', true);
        });

        it('sends updateVowel if there are less than 5 vowels', function(){
            let rndVowel = 'E';
            randomVowel.and.returnValue(rndVowel);

            user.getRoom.and.returnValue(room);
            room.data = {
                letterList: {
                    letters: [],
                    vowelNum: 4
                }
            }
            cloakConfig.messages.getVowel('', user);

            expect(room.messageMembers).toHaveBeenCalledWith('updateVowel', rndVowel);
        });
    });

    describe('checkListLength', () => {
        it('sends user disableConsonant message if there are 9 or more letters in the letterList', function() {
            user.getRoom.and.returnValue(room);
            room.data = {
                letterList: {
                    letters: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
                    vowelNum: 4,
                    disableConsonant: false,
                    disableVowel: false
                }
            }
            cloakConfig.messages.getVowel('', user);

            expect(user.message).toHaveBeenCalledWith('disableConsonant', true);
        });

        it('sends user disableVowel message if there are 9 or more letters in the letterList', function() {
            user.getRoom.and.returnValue(room);
            room.data = {
                letterList: {
                    letters: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
                    vowelNum: 4,
                    disableConsonant: false,
                    disableVowel: false
                }
            }
            cloakConfig.messages.getVowel('', user);

            expect(user.message).toHaveBeenCalledWith('disableVowel', true);
        });

        it('sets disableConsonant to true if there are 9 or more letters in the letter list', function() {
            user.getRoom.and.returnValue(room);
            room.data = {
                letterList: {
                    letters: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
                    vowelNum: 4,
                    disableConsonant: false,
                    disableVowel: false
                }
            }
            cloakConfig.messages.getVowel('', user);

            expect(room.data.letterList.disableConsonant).toEqual(true);
        });

        it('sets disableVowel to true if there are 9 or more letters in the letter list', function() {
            user.getRoom.and.returnValue(room);
            room.data = {
                letterList: {
                    letters: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
                    vowelNum: 4,
                    disableConsonant: false,
                    disableVowel: false
                }
            }
            cloakConfig.messages.getVowel('', user);

            expect(room.data.letterList.disableVowel).toEqual(true);
        });
    });
});