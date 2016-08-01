var mockery = require('mockery');

var cloak;
var cloakConfig;
var lobby;
var user;
var room;
var users;
var rooms;
var disconnect;

describe('cloak server', () => {
    var randomConsonant;
    var randomVowel;
    beforeEach(() => {
        randomConsonant = jasmine.createSpy('randomConsonant');
        randomVowel = jasmine.createSpy('randomVowel');
    });

    beforeEach(() => {
        mockery.enable({ useCleanCache: true });
    });

    beforeEach(() => {
        mockery.registerMock('./random-consonant-picker', randomConsonant);
        mockery.registerAllowable('./cloak-server');
        mockery.registerAllowable('./letter-lists');
        mockery.registerMock('./random-vowel-picker', randomVowel);
        mockery.registerAllowable('./game-parameters');
    });

    beforeEach(() => {
        cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'getLobby', 'getRooms', 'createRoom', 'getRoom']);
        lobby = jasmine.createSpyObj('lobby', ['getMembers', 'messageMembers', 'removeMember']);
        user = jasmine.createSpyObj('user', ['getRoom', 'message']);
        room = jasmine.createSpyObj('room', ['removeMember', 'addMember', 'messageMembers', 'getMembers']);
    });

    beforeEach(() => {
        cloak.getLobby.and.returnValue(lobby);

        cloak.configure.and.callFake(_config_ => {
            cloakConfig = _config_;
        });

        mockery.registerMock('cloak', cloak);
    });

    beforeEach(() => {
        require('./cloak-server')({});
    });

    afterEach(() => {
        mockery.deregisterAll();
    });

    afterEach(() => {
        mockery.disable();
    });

    describe('cloak setup tests', () => {
        it('calls configure', () => {
            expect(cloak.configure).toHaveBeenCalled();
        });

        it('calls run', () => {
            expect(cloak.run).toHaveBeenCalled();
        });
    });

    describe('lobby newMember', () => {
        it('on creating a new member, refreshLobby message sent with correct list of users', () => {
            users = ['Raul', 'Jamie'];
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            lobby.getMembers.and.returnValue(users);

            cloakConfig.lobby.newMember();

            expect(lobby.messageMembers).toHaveBeenCalledWith('refreshLobby', users);
        });

        it('on creating a new member, refreshRooms message sent with correct list of rooms', () => {
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});      
            lobby.getMembers.and.returnValue(users);

            cloakConfig.lobby.newMember();

            expect(lobby.messageMembers).toHaveBeenCalledWith('refreshRooms', rooms);
        });

    });

    describe('room newMember', () => {
        it('sends startGame if the game was started in the joined room', () => {
            users = ['Raul', 'Jamie'];
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            room.getMembers.and.returnValue(users);
            room.data = {
                started: true,
                leaderIndex: 0,
                leaderId: '',
                answering: false,
                creator: {
                    id: ''
                },
                letterList: {
                    letters: [],
                    consonantNum: 0,
                    vowelNum: 0,
                    disableConsonant: false,
                    disableVowel: false
                }
            };

            cloakConfig.room.newMember.bind(room, user)();

            expect(user.message).toHaveBeenCalledWith('startGame');
        });

        it('sends resetLetters if the game was started in the joined room', () => {
            users = ['Raul', 'Jamie'];
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            room.getMembers.and.returnValue(users);
            room.data = {
                started: true,
                leaderIndex: 0,
                leaderId: '',
                answering: false,
                creator: {
                    id: ''
                },
                letterList: {
                    letters: ['a','b','c'],
                    consonantNum: 0,
                    vowelNum: 0,
                    disableConsonant: false,
                    disableVowel: false
                }
            };

            cloakConfig.room.newMember.bind(room, user)();

            expect(user.message).toHaveBeenCalledWith('resetLetters', ['a','b','c']);
        });

        it('sends startAnswering if the answering phase was started in the joined room', () => {
            users = ['Raul', 'Jamie'];
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            room.getMembers.and.returnValue(users);
            room.data = {
                started: true,
                leaderIndex: 0,
                leaderId: '',
                answering: true,
                answerTime: 30,
                creator: {
                    id: ''
                },
                letterList: {
                    letters: ['a','b','c'],
                    consonantNum: 0,
                    vowelNum: 0,
                    disableConsonant: false,
                    disableVowel: false
                }
            };

            cloakConfig.room.newMember.bind(room, user)();

            expect(user.message).toHaveBeenCalledWith('startAnswering', 30);
        });

        it('sends stopAnswering if the game is not in the answering phase in the joined room', () => {
            users = ['Raul', 'Jamie'];
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            room.getMembers.and.returnValue(users);
            room.data = {
                started: true,
                leaderIndex: 0,
                leaderId: '',
                answering: false,
                creator: {
                    id: ''
                },
                letterList: {
                    letters: ['a','b','c'],
                    consonantNum: 0,
                    vowelNum: 0,
                    disableConsonant: false,
                    disableVowel: false
                }
            };

            cloakConfig.room.newMember.bind(room, user)();

            expect(user.message).toHaveBeenCalledWith('stopAnswering');
        });
    });

    describe('setUserUp', () => {
        it('updates user correctly', () => {
            user.data = {name: "name", id: 0};
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.setUserUp("", user);
            var userData = {name: user.name, id: user.id};

            expect(userData).toEqual(user.data);
        });

        it('sends updateData message', () => {
            user.data = {name: "name", id: 0};
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.setUserUp("", user);
            var userData = {name: user.name, id: user.id};

            expect(user.message).toHaveBeenCalledWith('updateData', user.data);
        });
    });

    it('setUsername: sets user.name to the passed argument', () => {
        user.data = {name: "name", id: 0};
        lobby.getMembers.and.returnValue([]);

        cloakConfig.messages.setUsername('TEST_USERNAME', user);

        expect(user.name).toEqual('TEST_USERNAME');
    });


    describe('createRoom', () => {
        it('creates room with the passed argument', () => {
            user = {name: "name", id: 0};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue({data:{creator:''}});

            cloakConfig.messages.createRoom('TEST_ROOM_NAME', user);
            expect(cloak.createRoom).toHaveBeenCalledWith('TEST_ROOM_NAME');
        });

        it('updates creator', () => {
            user = {name: "name", id: "12345-abcde"};
            room = {name: "Room 1",data:{creator:{id:'sa',name:'sa'}}};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue(room);
 
            cloakConfig.messages.createRoom('TEST_ROOM_NAME', user);

            expect(room.data.creator).toEqual(user);
        });

        it('sets room to not started on creation', () => {
            user = {name: "name", id: "12345-abcde"};
            room = {name: "Room 1",data:{creator:{id:'sa',name:'sa'}}};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue(room);
 
            cloakConfig.messages.createRoom('TEST_ROOM_NAME', user);

            expect(room.data.started).toEqual(false);
        });

        it('sets room to not be in answering phase on creation', () => {
            user = {name: "name", id: "12345-abcde"};
            room = {name: "Room 1",data:{creator:{id:'sa',name:'sa'}}};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue(room);
 
            cloakConfig.messages.createRoom('TEST_ROOM_NAME', user);

            expect(room.data.answering).toEqual(false);
        });

        it('sets list of allowed users to empty on creation', () => {
            user = {name: "name", id: "12345-abcde"};
            room = {name: "Room 1",data:{creator:{id:'sa',name:'sa'}}};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue(room);
 
            cloakConfig.messages.createRoom('TEST_ROOM_NAME', user);

            expect(room.data.userIdList).toEqual([]);
        });

        it('sets letterList to its initial state on creation of the room', () => {
            user = {name: "name", id: "12345-abcde"};
            room = {name: "Room 1",data:{creator:{id:'sa',name:'sa'}}};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue(room);
 
            cloakConfig.messages.createRoom('TEST_ROOM_NAME', user);

            expect(room.data.letterList).toEqual({
                letters: [],
                consonantNum: 0,
                vowelNum: 0,
                disableConsonant: false,
                disableVowel: false
            });
        });
    });

    describe('joinRoom', () => {
        it('finds the room that has the ID passed as argument', () => {
            user.data = {name: "name", id: 0};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue(room);
            room.data = {userIdList: []};
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);

            expect(cloak.getRoom).toHaveBeenCalledWith('TEST_ROOM_ID');
        });

        it('makes the current user join the room with the correct ID', () => {
            user.data = {name: "name", id: 0};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue(room);
            room.data = {userIdList: []};
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);

            expect(room.addMember).toHaveBeenCalledWith(user);
        });

        it('sets the score of the current user to 0', () => {
            user.data = {name: "name", id: 0};
            rooms = [{id:'1'}];
            room.data = {userIdList: []};
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue(room);
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);
            
            expect(user.data.score).toEqual(0);
        });

        it('adds the id of the users to the list of alowed ids', () => {
            user.data = {name: "name", id: 0};
            user.id = '1234';
            rooms = [{id:'1'}];
            room.data = {userIdList: []};
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue(room);
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);
            
            expect(room.data.userIdList).toEqual(['1234']);
        });
    });

    describe('refreshRoomUsers ', () => {
        it('the members of the correct room are retrieved', () => {
            room.getMembers.and.returnValue([]);
            room.data = {};

            cloakConfig.room.newMember.bind(room,'')();

            expect(room.getMembers).toHaveBeenCalled();
        });
    });

    describe('leaveRoom ', () => {
        it('the correct room is retrieved for the user', () => {
            user.getRoom.and.returnValue(room);
            user.data = {score: 0};
            room.data = {
                leaderIndex: 0
            };
            room.getMembers.and.returnValue(['', user]);

            cloakConfig.messages.leaveRoom('', user);

            expect(user.getRoom).toHaveBeenCalled();
        });
        it('the correct user is removed from the room', () => {
            user.getRoom.and.returnValue(room);
            user.data = {score: 0};
            room.data = {
                leaderIndex: 0
            };
            room.getMembers.and.returnValue(['', user]);
            
            cloakConfig.messages.leaveRoom('', user);

            expect(room.removeMember).toHaveBeenCalledWith(user);
        })
        it('sets the score of the user user that is removed from the room to undefined', () => {
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
        it('retrieves the correct room from the server', () => {
            let roomDetails = {id: 1, name: 'Room 1', data:{started: false}};
            cloak.getRoom.and.returnValue(roomDetails);

            cloakConfig.messages.roomDetails(1, user);

            expect(user.message).toHaveBeenCalledWith('roomDetailsResponse', roomDetails);
        })
    });

    describe('startGame ', () => {
        it('retrieves the correct room ', () => {
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

        it('initializes the room data correctly', () => {
            user.getRoom.and.returnValue(room);
            user.id = '1232445';
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
                    leaderId: '1232445',
                    started: true,
                    letterList: {
                        disableConsonant: false,
                        disableVowel: true
                    }
            });
        })

        it('calls setLeader with correct room', () => {
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

        it('updates the leader index of the correct user in the room', () => {
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
        it('sends disableConsonant if there are 6 or more consonants', () =>{
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

        it('sends updateConsonant if there are less than 6 consonants', () =>{
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
        it('sends disableVowel if there are 5 or more vowels', () =>{
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

        it('sends updateVowel if there are less than 5 vowels', () =>{
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
        it('sends user disableConsonant message if there are 9 or more letters in the letterList', () => {
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

        it('sends user disableVowel message if there are 9 or more letters in the letterList', () => {
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

        it('sets disableConsonant to true if there are 9 or more letters in the letter list', () => {
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

        it('sets disableVowel to true if there are 9 or more letters in the letter list', () => {
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

    describe('removeFromRoomList ', () => {
        it('removes the user from the list if the room with the id given exists', () => {
            let room = {
                id: 12,
                data:{
                    userIdList: ['FAKEUSER1','FAKEUSER2',5, 'FAKEUSER3']
                }
            }
            cloak.getRoom.and.returnValue(room);

            cloakConfig.messages.removeFromRoomList(12, {id:5});

            expect(room.data.userIdList).toEqual(['FAKEUSER1','FAKEUSER2','FAKEUSER3']);
        })
    });

    describe('checkRoom ', () => {
        it('blocks the user from joining if the room does not exist', () => {
            cloak.getRoom.and.returnValue(false);

            cloakConfig.messages.checkRoom('', user);

            expect(user.message).toHaveBeenCalledWith('allowedToJoin', false);
        });

        it('allows the user to join if the game has not started in the room', () => {
            cloak.getRoom.and.returnValue({data: {started: false}});

            cloakConfig.messages.checkRoom('', user);

            expect(user.message).toHaveBeenCalledWith('allowedToJoin', true);
        });

        it('allows the user to join if the game has started and user is in the list of allowedUsers', () => {
            var room = {
                data:{
                    started: true,
                    userIdList: ['FAKE0', '1234', 'FAKE1', 'FAKE2']
                }
            };
            cloak.getRoom.and.returnValue(room);
            user.id = '1234';

            cloakConfig.messages.checkRoom('', user);

            expect(user.message).toHaveBeenCalledWith('allowedToJoin', true);
        });

        it('blocks the user from joining if the game has started and user is not on the list of allowedUsers', () => {
            var room = {
                data:{
                    started: true,
                    userIdList: ['FAKE0', 'FAKE1', 'FAKE2']
                }
            };
            cloak.getRoom.and.returnValue(room);
            user.id = '1234';

            cloakConfig.messages.checkRoom('', user);

            expect(user.message).toHaveBeenCalledWith('allowedToJoin', false);
        });
    });
});