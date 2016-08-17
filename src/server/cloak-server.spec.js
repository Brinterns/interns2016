let mockery = require('mockery');

let parameters = {
    answerTime : 20,
    submitTime : 10,
    numLetters : 9,
    minUserNo : 2,
    rounds : {
        letters: true, 
        numbers: false
    }
};

let cloak;
let cloakConfig;
let lobby;
let user;
let room;
let users;
let rooms;
let disconnect;
let letterList;
let solver;
let roomDataService;

describe('cloak server', () => {
    let randomConsonant;
    let randomVowel;
    let setIntervalSpy;
    let setTimeoutSpy;

    beforeEach(() => {
        randomConsonant = jasmine.createSpy('randomConsonant');
        randomVowel = jasmine.createSpy('randomVowel');
        solver = jasmine.createSpyObj('solver', ['solve_letters']);
        jasmine.clock().install();
    });

    beforeEach(() => {
        mockery.enable({ useCleanCache: true });
    });

    beforeEach(() => {
        mockery.registerAllowable('./cloak-server');
        mockery.registerAllowable('./letters/letter-lists');
        mockery.registerAllowable('./dictionary');
        mockery.registerAllowable('./services/room-data-service');
        mockery.registerAllowable('./numbers-round/numbers-round');
        mockery.registerMock('./vendor/validation/cntdn', solver);
        mockery.registerMock('./parameters', parameters);
        mockery.registerMock('./letters/random-consonant-picker', randomConsonant);
        mockery.registerMock('./letters/random-vowel-picker', randomVowel);
    });

    beforeEach(() => {
        cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'getLobby', 'getRooms', 'createRoom', 'getRoom']);
        lobby = jasmine.createSpyObj('lobby', ['getMembers', 'messageMembers', 'removeMember']);
        user = jasmine.createSpyObj('user', ['getRoom', 'message']);
        room = jasmine.createSpyObj('room', ['removeMember', 'addMember', 'messageMembers', 'getMembers']);
        roomDataService = jasmine.createSpyObj('roomDataService', ['initialRoomData', 'setRounds']);
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
        jasmine.clock().uninstall();
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

        function makeRoom(answering, letters = [], answerTime) {
            var roomDataObj = {
                started: true,
                leaderIndex: 0,
                leaderId: '',
                answering: answering,
                answerTime: answerTime,
                creator: {
                    id: ''
                },
                scores: [],
                letterList: {
                    letters: letters,
                    consonantNum: 0,
                    vowelNum: 0,
                    disableConsonant: false,
                    disableVowel: false
                }
            }

            return roomDataObj;
        }

        it('sends startGame if the game was started in the joined room', () => {
            users = [{name: 'Raul',data:{}},
                     {name: 'Jamie',data:{}}];
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            room.getMembers.and.returnValue(users);
            room.data = makeRoom(false, []);

            cloakConfig.room.newMember.bind(room, user)();

            expect(user.message).toHaveBeenCalledWith('startGame');
        });

        it('sends resetLetters if the game was started in the joined room', () => {
            users = [{name: 'Raul',data:{}},
                     {name: 'Jamie',data:{}}];
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            room.getMembers.and.returnValue(users);
            room.data = makeRoom(false, ['a', 'b', 'c']);

            cloakConfig.room.newMember.bind(room, user)();

            expect(user.message).toHaveBeenCalledWith('resetLetters', ['a','b','c']);
        });

        it('sends startAnswering if the answering phase was started in the joined room', () => {
            users = [{name: 'Raul',data:{}},
                     {name: 'Jamie',data:{}}];
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            room.getMembers.and.returnValue(users);
            room.data = makeRoom(true, ['a','b','c'], parameters.answerTime);
            
            cloakConfig.room.newMember.bind(room, user)();

            expect(user.message).toHaveBeenCalledWith('startAnswering', parameters.answerTime);
        });

        it('sends stopAnswering if the game is not in the answering phase in the joined room', () => {
            users = [{name: 'Raul',data:{}},
                     {name: 'Jamie',data:{}}];
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            room.getMembers.and.returnValue(users);
            room.data = makeRoom(false, ['a','b','c']);

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
            rooms = [{id: '1'}];
            var options = {name: 'TEST_ROOM_NAME', rounds: {letter: 5}};
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue({data:{creator:''}});

            cloakConfig.messages.createRoom(options, user);
            expect(cloak.createRoom).toHaveBeenCalledWith(options.name);
        });

        it('updates creator', () => {
            room = {name: "Room 1", data: {creator: {id:'sa', name:'sa'}}};
            rooms = [{id:'1'}];
            user.name = 'BOBSAGET';
            user.id = 69; 
            var options = {name: 'TEST_ROOM_NAME', rounds: {letter: 5}};
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue(room);
 
            cloakConfig.messages.createRoom(options, user);

            expect(room.data.creator).toEqual({id: user.id, name: user.name});
        });

        it('sets room to not started on creation', () => {
            room = {name: "Room 1",data:{creator:{id:'sa',name:'sa'}}};
            rooms = [{id:'1'}];
            var options = {name: 'TEST_ROOM_NAME', rounds: {letter: 5}};

            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue(room);
 
            cloakConfig.messages.createRoom(options, user);

            expect(room.data.started).toEqual(false);
        });

        it('sets room to not be in answering phase on creation', () => {
            room = {name: "Room 1",data:{creator:{id:'sa',name:'sa'}}};
            rooms = [{id:'1'}];
            var options = {name: 'TEST_ROOM_NAME', rounds: {letter: 5}};

            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue(room);
 
            cloakConfig.messages.createRoom(options, user);

            expect(room.data.answering).toEqual(false);
        });

        it('sets list of allowed users to empty on creation', () => {
            room = {name: "Room 1",data:{creator:{id:'sa',name:'sa'}}};
            rooms = [{id:'1'}];
            var options = {name: 'TEST_ROOM_NAME', rounds: {letter: 5}};
            
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue(room);
 
            cloakConfig.messages.createRoom(options, user);

            expect(room.data.userIdList).toEqual([]);
        });

        it('sets letterList to its initial state on creation of the room', () => {
            room = {name: "Room 1",data:{creator:{id:'sa',name:'sa'}}};
            rooms = [{id:'1'}];
            var options = {name: 'TEST_ROOM_NAME', rounds: {letter: 5}};

            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue({data:''});
            cloak.createRoom.and.returnValue(room);
 
            cloakConfig.messages.createRoom(options, user);

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
            room.data = {userIdList: [], scores: []};
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);

            expect(cloak.getRoom).toHaveBeenCalledWith('TEST_ROOM_ID');
        });

        it('makes the current user join the room with the correct ID', () => {
            user.data = {name: "name", id: 0};
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue(room);
            room.data = {userIdList: [], scores: []};
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);

            expect(room.addMember).toHaveBeenCalledWith(user);
        });

        it('sets the score of the current user to 0', () => {
            user.data = {name: "name", id: '1234'};
            user.id = '1234'
            rooms = [{id:'1'}];
            room.data = {userIdList: [], scores: []};
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue(room);
            lobby.getMembers.and.returnValue([]);

            cloakConfig.messages.joinRoom('TEST_ROOM_ID', user);

            expect(room.data.scores['1234']).toEqual(0);
        });

        it('adds the id of the users to the list of alowed ids', () => {
            user.data = {name: "name", id: 0};
            user.id = '1234';
            rooms = [{id:'1'}];
            room.data = {userIdList: [], scores: []};
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

            cloakConfig.room.newMember.bind(room, user)();

            expect(room.getMembers).toHaveBeenCalled();
        });
    });

    describe('leaveRoom ', () => {
        it('the correct room is retrieved for the user', () => {
            user.getRoom.and.returnValue(room);
            user.data = {score: 0};
            user.id = 1234;
            room.data = {
                leaderIndex: 0,
                scores: {
                    1234: 10
                }
            };
            room.getMembers.and.returnValue(['', user]);

            cloakConfig.messages.leaveRoom('', user);

            expect(user.getRoom).toHaveBeenCalled();
        });

        it('the correct user is removed from the room', () => {
            user.getRoom.and.returnValue(room);
            user.data = {score: 0};
            user.id = 1234;
            room.data = {
                leaderIndex: 0,
                scores: {
                    1234: 10
                }
            };
            room.getMembers.and.returnValue(['', user]);

            cloakConfig.messages.leaveRoom('', user);

            expect(room.removeMember).toHaveBeenCalledWith(user);
        });

        it('resets the score of the user if he leaves the room', () => {
            user.getRoom.and.returnValue(room);
            user.data = {score: 0};
            user.id = 1234;
            room.data = {
                leaderIndex: 0,
                scores: {
                    1234: 10
                }
            };
            room.getMembers.and.returnValue(['', user]);

            cloakConfig.messages.leaveRoom('', user);

            expect(room.data.scores).toEqual({});
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
                },
                rounds: []
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
                },
                rounds: []
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
                    },
                    rounds: []
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
                },
                rounds: ['L']
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
                },
                rounds: []
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
        beforeEach(() => {
            room.data = {
                letterList: {
                    letters: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
                    vowelNum: 4,
                    disableConsonant: false,
                    disableVowel: false
                },
                answerTime: parameters.answerTime,
                submitTime: parameters.submitTime
            }
            user.getRoom.and.returnValue(room);
        });

        it('sends user disableConsonant message if there are 9 or more letters in the letterList', () => {
            cloakConfig.messages.getVowel('', user);

            expect(user.message).toHaveBeenCalledWith('disableConsonant', true);
        });

        it('sends user disableVowel message if there are 9 or more letters in the letterList', () => {
            cloakConfig.messages.getVowel('', user);

            expect(user.message).toHaveBeenCalledWith('disableVowel', true);
        });

        it('sets disableConsonant to true if there are 9 or more letters in the letter list', () => {
            cloakConfig.messages.getVowel('', user);

            expect(room.data.letterList.disableConsonant).toEqual(true);
        });

        it('sets disableVowel to true if there are 9 or more letters in the letter list', () => {
            cloakConfig.messages.getVowel('', user);

            expect(room.data.letterList.disableVowel).toEqual(true);
        });

        it('calls startAnswering if there are 9 or more letters in the letter list', () => {
            cloakConfig.messages.getVowel('', user);

            expect(room.messageMembers).toHaveBeenCalledWith('startAnswering', parameters.answerTime);
        });

        it('startAnswering sets room.data.answering to true', () => {
            cloakConfig.messages.getVowel('', user);

            expect(room.data.answering).toEqual(true);
        });

        it('startAnswering updates room data after every interval tick', () => {
            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(1001);

            expect(room.data.answerTime).toEqual(parameters.answerTime - 1);
        });

        it('startAnswering sends stopAnswering message after timeout', () => {
            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(parameters.answerTime * 1000);

            expect(room.messageMembers).toHaveBeenCalledWith('stopAnswering');
        });

        it('answeringFinished sets room.data.answering to false', () => {
            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(parameters.answerTime * 1000);

            expect(room.data.answering).toEqual(false);
        });

        it('answeringFinished sends startSubmission message', () => {
            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(parameters.answerTime * 1000);

            expect(room.messageMembers).toHaveBeenCalledWith('startSubmission', parameters.submitTime);
        });

        it('startSubmission sets room.data.submitting to true', () => {
            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(parameters.answerTime * 1000);

            expect(room.data.submitting).toEqual(true);
        });

        it('submitTime is updated to be in sync after every time tick', () => {
            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(parameters.answerTime * 1000);

            jasmine.clock().tick(1000);

            expect(room.data.submitTime).toEqual(parameters.submitTime - 1);
        });

        it('submissionFinished sends stopSubmission after the submitTime expires', () => {
            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(parameters.answerTime * 1000);
            jasmine.clock().tick(parameters.submitTime * 1000);

            expect(room.messageMembers).toHaveBeenCalledWith('stopSubmission');
        });

        it('submissionFinished sets room.data.submitting to false after the submitTime expires', () => {
            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(parameters.answerTime * 1000);
            jasmine.clock().tick(parameters.submitTime * 1000);

            expect(room.data.submitting).toEqual(false);
        });
    });

    describe('removeFromRoomList ', () => {
        it('removes the user from the list if the room with the id given exists', () => {
            let room = {
                id: 12,
                data:{
                    userIdList: ['FAKEUSER1','FAKEUSER2',5, 'FAKEUSER3'],
                    scores: []
                }
            }
            cloak.getRoom.and.returnValue(room);

            cloakConfig.messages.removeFromRoomList(12, {id:5});

            expect(room.data.userIdList).toEqual(['FAKEUSER1','FAKEUSER2','FAKEUSER3']);
        });

        it('removes the user score from the list of scores if the room with the id given exists', () => {
            let room = {
                id: 12,
                data:{
                    userIdList: ['FAKEUSER1','FAKEUSER2',5, 'FAKEUSER3'],
                    scores: {
                        '1234': 232,
                        'abc': 0,
                        'fake': 1
                    }
                }
            }
            cloak.getRoom.and.returnValue(room);

            cloakConfig.messages.removeFromRoomList(12, {id: '1234'});

            expect(room.data.scores).toEqual({
                'abc': 0,
                'fake': 1
            });
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

    describe('resetScore', () => {
        it('sets the score of the user to undefined', () => {
            rooms = [{id:'1'}];
            cloak.getRooms.and.returnValue(rooms);
            cloak.getRoom.and.returnValue(room);
            room.data = {userIdList: [], scores: []};
            lobby.getMembers.and.returnValue([]);

            user.data = {
                score : 400
            };

            cloakConfig.messages.resetScore('', user);

            expect(user.data.score).toEqual(undefined);
        });
    });

    describe('submitAnswer ', () =>{
        beforeEach( () => {
            room.data = {
                letterList:{
                    letters: ['W', 'O', 'R', 'D', 'E', 'F', 'G', 'H'],
                    vowelNum: 4,
                    disableConsonant: false,
                    disableVowel: false
                },
                finalAnswerList: {},
                possibleAnswers: {
                    fakeId: ['fakeAnswer', 'fakeAnswer1']
                }
            };
            user.id = 'fakeId'
            user.getRoom.and.returnValue(room);
            room.getMembers.and.returnValue([]);
        });

        it('gets the correct room', () => {
            cloakConfig.messages.submitAnswer(0, user);

            expect(user.getRoom).toHaveBeenCalled();
        });

        it('updates the answer of the user if the answer is undefined', () => {
            cloakConfig.messages.submitAnswer(0, user);

            expect(room.data.finalAnswerList).toEqual({
                'fakeId':'fakeAnswer'
            });
        });

        it('does not change the answer of the users if the answer is not undefined', () => {
            room.data.finalAnswerList = {
                'fakeId': 'fakeAnswer1'
            };

            cloakConfig.messages.submitAnswer(1, user);

            expect(room.data.finalAnswerList).toEqual({
                'fakeId': 'fakeAnswer1'
            });
        });

        it('submitting all answers calls the solver to return list of all valid possible answers', () => {
            user.id = 'fakeId1';
            room.data.possibleAnswers = {
                'fakeId1': ['word1']
            }
            room.data.finalAnswerList = {
                'fakeId1': 'word1',
                'fakeId2': 'word24'
            };
            room.getMembers.and.returnValue([
                {id: 'fakeId1', name:'fake1'},
                {id: 'fakeId2', name:'fake2'}
            ]);
            solver.solve_letters.and.returnValue([]);

            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(parameters.answerTime * 1000);
            cloakConfig.messages.submitAnswer(0, user);

            expect(solver.solve_letters).toHaveBeenCalled();
        });

        it('changes the score of only the best answer out of all answers', () => {
            user.id = 'fakeId1';
            room.data.possibleAnswers = {
                'fakeId1': ['word']
            }
            room.data.finalAnswerList = {
                'fakeId1': 'word1',
                'fakeId2': 'word24'
            };
            room.data.scores = {
                'fakeId1': 6,
                'fakeId2': 4
            }
            room.getMembers.and.returnValue([
                {id: 'fakeId1', name:'fake1', data: {}},
                {id: 'fakeId2', name:'fake2', data: {}}
            ]);
            solver.solve_letters.and.returnValue(['word1']);

            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(parameters.answerTime * 1000);
            cloakConfig.messages.submitAnswer(0, user);
            expect(room.data.scores).toEqual({
                'fakeId1': 11,
                'fakeId2': 4
            });
        });

        it('gives double points for the users who answers a word with all 9 letters', () => {
            user.id = 'fakeId1';
            room.data.possibleAnswers = {
                'fakeId1': ['word']
            }
            room.data.finalAnswerList = {
                'fakeId1': 'verylongw',
                'fakeId2': 'word24',
                'fakeId3': 'fakelonga'
            };
            room.data.scores = {
                'fakeId1': 6,
                'fakeId2': 4,
                'fakeId3': 7
            }
            room.getMembers.and.returnValue([
                {id: 'fakeId1', name:'fake1', data: {}},
                {id: 'fakeId2', name:'fake2', data: {}},
                {id: 'fakeId3', name:'fake3', data: {}}
            ]);
            solver.solve_letters.and.returnValue(['verylongw','fakelonga']);

            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(parameters.answerTime * 1000);
            cloakConfig.messages.submitAnswer(0, user);
            expect(room.data.scores).toEqual({
                'fakeId1': 24,
                'fakeId2': 4,
                'fakeId3': 25
            });
        });

        it('maintains all scores the same if no one answered correctly', () => {
            user.id = 'fakeId1';
            room.data.possibleAnswers = {
                'fakeId1': ['word']
            }
            room.data.finalAnswerList = {
                'fakeId1': 'verylongw',
                'fakeId2': 'word24',
                'fakeId3': 'fakelonga'
            };
            room.data.scores = {
                'fakeId1': 6,
                'fakeId2': 4,
                'fakeId3': 7
            }
            room.getMembers.and.returnValue([
                {id: 'fakeId1', name:'fake1', data: {}},
                {id: 'fakeId2', name:'fake2', data: {}},
                {id: 'fakeId3', name:'fake3', data: {}}
            ]);
            solver.solve_letters.and.returnValue([]);

            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(parameters.answerTime * 1000);
            cloakConfig.messages.submitAnswer(0, user);
            expect(room.data.scores).toEqual({
                'fakeId1': 6,
                'fakeId2': 4,
                'fakeId3': 7
            });
        });

        it('makes the round end if all users submitted an answer', () => {
            user.id = 'fakeId1';
            room.data.possibleAnswers = {
                'fakeId1': ['word']
            }
            room.data.finalAnswerList = {
                'fakeId1': 'word1',
            };
            room.data.scores = {
                'fakeId1': 6,
            }
            room.getMembers.and.returnValue([
                {id: 'fakeId1', name:'fake1', data: {}}
            ]);
            solver.solve_letters.and.returnValue(['word1']);

            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(parameters.answerTime * 1000);
            cloakConfig.messages.submitAnswer(0, user);
            expect(room.data.roundEnded).toEqual(true);
        });

        it('sends a list of all the answers submitted by the users to everyone in the room', () => {
            user.id = 'fakeId1';
            room.data.possibleAnswers = {
                'fakeId1': ['word']
            }
            room.data.finalAnswerList = {
                'fakeId1': 'word1',
            };
            room.data.scores = {
                'fakeId1': 6,
            }
            room.getMembers.and.returnValue([
                {id: 'fakeId1', name:'fake1', data: {}}
            ]);
            solver.solve_letters.and.returnValue(['word1']);

            cloakConfig.messages.getVowel('', user);
            jasmine.clock().tick(parameters.answerTime * 1000);
            cloakConfig.messages.submitAnswer(0, user);
            expect(room.messageMembers).toHaveBeenCalledWith('submittedAnswers',{
                fakeId1: {
                    name: 'fake1',
                    word: 'word1',
                    score: 5
                }
            });
        });
    });

    describe('possibleAnswers', () => {
        it('changes the room.data.possibleAnswers of a user to given answer list', () => {
            let fakeAnswerList = ['fakeAnswer1', 'fakeAnswer2'];
            user.getRoom.and.returnValue(room);
            room.data = {
                possibleAnswers: {}
            }
            user.id = 'fakeId';

            cloakConfig.messages.possibleAnswers(fakeAnswerList, user);

            expect(room.data.possibleAnswers).toEqual({
                'fakeId' : ['fakeAnswer1', 'fakeAnswer2']
            });
        });
    });
});
