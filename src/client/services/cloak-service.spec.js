import cloakService from './cloak-service.js';

const rewire = cloakService.__Rewire__;
const resetDependency = cloakService.__ResetDependency__;

describe('cloak service', () => {
    let cloakConfig;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'message', 'connected', 'stop']);
    });

    beforeEach(() => {
        window.cloak.configure.and.callFake(_config_ => {
            cloakConfig = _config_;
        });
        cloakService.configureAndRun();
    })

    it('configures the client', () => {
        expect(window.cloak.configure).toHaveBeenCalled();
    })

    it('runs the client', () => {
        expect(window.cloak.run).toHaveBeenCalled();
    })

    describe('serverEvents', () => {
        it('sends setUserUp to the server', () => {
            cloakConfig.serverEvents.begin();

            expect(window.cloak.message).toHaveBeenCalledWith('setUserUp');
        });

        it('does not send checkRoom if roomId is undefined', () => {
            cloakConfig.serverEvents.begin();

            expect(window.cloak.message).not.toHaveBeenCalledWith('checkRoom', undefined);
        });

        it('sends checkRoom if roomId is not undefined', () => {
            cloakService.configureAndRun('fakeRoomId1')

            cloakConfig.serverEvents.begin();

            expect(window.cloak.message).toHaveBeenCalledWith('checkRoom', 'fakeRoomId1');
        })
    });

    describe('messages', () => {
        let dispatch;
        beforeEach(() => {
            dispatch = jasmine.createSpy('dispatch');
            rewire('dispatch', dispatch);
        });

        afterEach(() => {
            resetDependency('dispatch');
        });

        describe('refreshLobby response', () => {
            let refreshLobby;
            beforeEach(() => {
                refreshLobby = jasmine.createSpy('refreshLobby');
                rewire('refreshLobby', refreshLobby);
            });

            afterEach(() => {
                resetDependency('refreshLobby');
            });

            it('should call refreshLobby', () => {
                const lobbyList = 'lobbyList';
                refreshLobby.and.callFake(lobbyListArg => lobbyListArg);

                cloakConfig.messages.refreshLobby(lobbyList);

                expect(refreshLobby).toHaveBeenCalledWith(lobbyList);
            });

            it('should dispatch the result of calling refreshLobby', () => {
                const lobbyList = 'lobbyList';
                refreshLobby.and.callFake(lobbyListArg => lobbyListArg);

                cloakConfig.messages.refreshLobby(lobbyList);

                expect(dispatch).toHaveBeenCalledWith(lobbyList)
            })
        });

        describe('updateData response', () => {
            let storageService;
            beforeEach(() => {
                storageService = jasmine.createSpyObj('storageService', ['storeId', 'storeName']);
                rewire('storageService', storageService);
            });

            afterEach(() => {
                resetDependency('storageService');
            });

            it('should call the storeId of the storageService', () => {
                cloakConfig.messages.updateData({
                    id: 'fakeID1',
                    name: 'name1'
                });

                expect(storageService.storeId).toHaveBeenCalledWith('fakeID1');
            });

            it('should call the storeName of the storageService', () => {
                cloakConfig.messages.updateData({
                    id: 'fakeID1',
                    name: 'name1'
                });

                expect(storageService.storeName).toHaveBeenCalledWith('name1');
            });
        });

        describe('refreshRooms response', () => {
            let refreshRooms;
            beforeEach(() => {
                refreshRooms = jasmine.createSpy('refreshRooms');
                rewire('refreshRooms', refreshRooms);
            });

            afterEach(() => {
                resetDependency('refreshRooms');
            });

            it('should call refreshRooms', () => {
                const roomList = 'roomList';
                refreshRooms.and.callFake(roomListArg => roomListArg);

                cloakConfig.messages.refreshRooms(roomList);

                expect(refreshRooms).toHaveBeenCalledWith(roomList);
            });

            it('should dispatch the result of calling refreshRooms', () => {
                const roomList = 'roomList';
                refreshRooms.and.callFake(roomListArg => roomListArg);

                cloakConfig.messages.refreshRooms(roomList);

                expect(dispatch).toHaveBeenCalledWith(roomList);
            })
        });

        describe('refreshRoomUsers response', () => {
            let refreshRoomUsers;
            beforeEach(() => {
                refreshRoomUsers = jasmine.createSpy('refreshRoomUsers');
                rewire('refreshRoomUsers', refreshRoomUsers);
            });

            afterEach(() => {
                resetDependency('refreshRoomUsers');
            });

            it('should call refreshRoomUsers', () => {
                const roomUserList = 'roomUserList';
                refreshRoomUsers.and.callFake(roomUserListArg => roomUserListArg);

                cloakConfig.messages.refreshRoomUsers(roomUserList);

                expect(refreshRoomUsers).toHaveBeenCalledWith(roomUserList);
            });

            it('should dispatch the result of calling refreshRoomUsers', () => {
                const roomUserList = 'roomUserList';
                refreshRoomUsers.and.callFake(roomUserListArg => roomUserListArg);

                cloakConfig.messages.refreshRoomUsers(roomUserList);

                expect(dispatch).toHaveBeenCalledWith(roomUserList);
            })
        });

        describe('roomDetailsResponse response', () => {
            let getRoomDetails;
            beforeEach(() => {
                getRoomDetails = jasmine.createSpy('getRoomDetails');
                rewire('getRoomDetails', getRoomDetails);
            });

            afterEach(() => {
                resetDependency('getRoomDetails');
            });

            it('should call getRoomDetails', () => {
                const roomDetails = 'roomDetails';
                getRoomDetails.and.callFake(roomDetailsArg => roomDetailsArg);

                cloakConfig.messages.roomDetailsResponse(roomDetails);

                expect(getRoomDetails).toHaveBeenCalledWith(roomDetails);
            });

            it('should dispatch the result of calling getRoomDetails', () => {
                const roomDetails = 'roomDetails';
                getRoomDetails.and.callFake(roomDetailsArg => roomDetailsArg);

                cloakConfig.messages.roomDetailsResponse(roomDetails);

                expect(dispatch).toHaveBeenCalledWith(roomDetails);
            })
        });

        describe('startGame response', () => {
            let startGame;
            beforeEach(() => {
                startGame = jasmine.createSpy('startGame');
                rewire('startGame', startGame);
            });

            afterEach(() => {
                resetDependency('startGame');
            });

            it('should call startGame', () => {
                cloakConfig.messages.startGame();

                expect(startGame).toHaveBeenCalled();
            });

            it('should dispatch the result of calling startGame', () => {
                cloakConfig.messages.startGame();

                expect(dispatch).toHaveBeenCalled();
            })
        });

        describe('setLeader response', () => {
            let setLeader;
            beforeEach(() => {
                setLeader = jasmine.createSpy('setLeader');
                rewire('setLeader', setLeader);
            });

            afterEach(() => {
                resetDependency('setLeader');
            });

            it('should call setLeader', () => {
                const leader = 'leader';
                setLeader.and.callFake(leaderArg => leaderArg);

                cloakConfig.messages.setLeader(leader);

                expect(setLeader).toHaveBeenCalledWith(leader);
            });

            it('should dispatch the result of calling setLeader', () => {
                const leader = 'leader';
                setLeader.and.callFake(leaderArg => leaderArg);

                cloakConfig.messages.setLeader(leader);

                expect(dispatch).toHaveBeenCalledWith(leader);
            })
        });

        describe('updateConsonant response', () => {
            let getConsonant;
            beforeEach(() => {
                getConsonant = jasmine.createSpy('getConsonant');
                rewire('getConsonant', getConsonant);
            });

            afterEach(() => {
                resetDependency('getConsonant');
            });

            it('should call getConsonant', () => {
                const consonant = 'consonant';
                getConsonant.and.callFake(consonantArg => consonantArg);

                cloakConfig.messages.updateConsonant(consonant);

                expect(getConsonant).toHaveBeenCalledWith(consonant);
            });

            it('should dispatch the result of calling getConsonant', () => {
                const consonant = 'consonant';
                getConsonant.and.callFake(consonantArg => consonantArg);

                cloakConfig.messages.updateConsonant(consonant);

                expect(dispatch).toHaveBeenCalledWith(consonant);
            })
        });

        describe('updateVowel response', () => {
            let getVowel;
            beforeEach(() => {
                getVowel = jasmine.createSpy('getVowel');
                rewire('getVowel', getVowel);
            });

            afterEach(() => {
                resetDependency('getVowel');
            });

            it('should call getVowel', () => {
                const vowel = 'vowel';
                getVowel.and.callFake(vowelArg => vowelArg);

                cloakConfig.messages.updateVowel(vowel);

                expect(getVowel).toHaveBeenCalledWith(vowel);
            });

            it('should dispatch the result of calling getVowel', () => {
                const vowel = 'vowel';
                getVowel.and.callFake(vowelArg => vowelArg);

                cloakConfig.messages.updateVowel(vowel);

                expect(dispatch).toHaveBeenCalledWith(vowel);
            })
        });

        describe('resetLetters response', () => {
            let resetLetters;
            beforeEach(() => {
                resetLetters = jasmine.createSpy('resetLetters');
                rewire('resetLetters', resetLetters);
            });

            afterEach(() => {
                resetDependency('resetLetters');
            });

            it('should call resetLetters', () => {
                const letters = ['a', 'b', 'c'];
                resetLetters.and.callFake(lettersArg => lettersArg);

                cloakConfig.messages.resetLetters(letters);

                expect(resetLetters).toHaveBeenCalledWith(letters);
            });

            it('should dispatch the result of calling resetLetters', () => {
                const letters = ['a', 'b', 'c'];
                resetLetters.and.callFake(lettersArg => lettersArg);

                cloakConfig.messages.resetLetters(letters);

                expect(dispatch).toHaveBeenCalledWith(letters);
            })
        });

        describe('disableConsonant response', () => {
            let disableConsonant;
            beforeEach(() => {
                disableConsonant = jasmine.createSpy('disableConsonant');
                rewire('disableConsonant', disableConsonant);
            });

            afterEach(() => {
                resetDependency('disableConsonant');
            });

            it('should call disableConsonant', () => {
                const disable = true;
                disableConsonant.and.callFake(boolArg => boolArg);

                cloakConfig.messages.disableConsonant(disable);

                expect(disableConsonant).toHaveBeenCalledWith(disable);
            });

            it('should dispatch the result of calling disableConsonant', () => {
                const disable = true;
                disableConsonant.and.callFake(boolArg => boolArg);

                cloakConfig.messages.disableConsonant(disable);

                expect(dispatch).toHaveBeenCalledWith(disable);
            })
        });

        describe('disableVowel response', () => {
            let disableVowel;
            beforeEach(() => {
                disableVowel = jasmine.createSpy('disableVowel');
                rewire('disableVowel', disableVowel);
            });

            afterEach(() => {
                resetDependency('disableVowel');
            });

            it('should call disableVowel', () => {
                const disable = true;
                disableVowel.and.callFake(boolArg => boolArg);

                cloakConfig.messages.disableVowel(disable);

                expect(disableVowel).toHaveBeenCalledWith(disable);
            });

            it('should dispatch the result of calling disableVowel', () => {
                const disable = true;
                disableVowel.and.callFake(boolArg => boolArg);

                cloakConfig.messages.disableVowel(disable);

                expect(dispatch).toHaveBeenCalledWith(disable);
            })
        });

        describe('startAnswering response', () => {
            let startAnswering;
            beforeEach(() => {
                startAnswering = jasmine.createSpy('startAnswering');
                rewire('startAnswering', startAnswering);
            });

            afterEach(() => {
                resetDependency('startAnswering');
            });

            it('should call startAnswering', () => {
                const time = 30;
                startAnswering.and.callFake(timeArg => timeArg);

                cloakConfig.messages.startAnswering(time);

                expect(startAnswering).toHaveBeenCalledWith(time);
            });

            it('should dispatch the result of calling startAnswering', () => {
                const time = 30;
                startAnswering.and.callFake(timeArg => timeArg);

                cloakConfig.messages.startAnswering(time);

                expect(dispatch).toHaveBeenCalledWith(time);
            })
        });

        describe('stopAnswering response', () => {
            let stopAnswering;
            beforeEach(() => {
                stopAnswering = jasmine.createSpy('stopAnswering');
                rewire('stopAnswering', stopAnswering);
            });

            afterEach(() => {
                resetDependency('stopAnswering');
            });

            it('should call stopAnswering', () => {
                cloakConfig.messages.stopAnswering();

                expect(stopAnswering).toHaveBeenCalled();
            });

            it('should dispatch the result of calling stopAnswering', () => {
                cloakConfig.messages.stopAnswering();

                expect(dispatch).toHaveBeenCalled();
            })
        });

        describe('enableStart response', () => {
            let disableStart;
            beforeEach(() => {
                disableStart = jasmine.createSpy('disableStart');
                rewire('disableStart', disableStart);
            });

            afterEach(() => {
                resetDependency('disableStart');
            });

            it('should call disableStart with false', () => {
                cloakConfig.messages.enableStart();

                expect(disableStart).toHaveBeenCalledWith(false);
            });

            it('should dispatch the result of calling disableStart with false', () => {
                cloakConfig.messages.enableStart();

                expect(dispatch).toHaveBeenCalled();
            })
        });

        describe('disableStart response', () => {
            let disableStart;
            beforeEach(() => {
                disableStart = jasmine.createSpy('disableStart');
                rewire('disableStart', disableStart);
            });

            afterEach(() => {
                resetDependency('disableStart');
            });

            it('should call disableStart with true', () => {
                cloakConfig.messages.disableStart();

                expect(disableStart).toHaveBeenCalledWith(true);
            });

            it('should dispatch the result of calling disableStart with true', () => {
                cloakConfig.messages.disableStart();

                expect(dispatch).toHaveBeenCalled();
            })
        });

        describe('allowedToJoin response', () => {
            let messageJoinRoom;
            let getRoomData;
            let router;
            beforeEach(() => {
                messageJoinRoom = jasmine.createSpy('messageJoinRoom');
                getRoomData = jasmine.createSpy('getRoomData');
                router = jasmine.createSpyObj('router', ['navigateToLobby']);
                rewire('messageJoinRoom', messageJoinRoom);
                rewire('getRoomData', getRoomData);
                rewire('router', router);
            });

            afterEach(() => {
                resetDependency('messageJoinRoom');
                resetDependency('getRoomData');
                resetDependency('router');
            });

            it('should call messageJoinRoom if response is true', () => {
                cloakService.configureAndRun('roomID1');

                cloakConfig.messages.allowedToJoin(true);

                expect(messageJoinRoom).toHaveBeenCalledWith('roomID1');
            });

            it('should call getRoomData if response is true', () => {
                cloakService.configureAndRun('roomID1');

                cloakConfig.messages.allowedToJoin(true);

                expect(getRoomData).toHaveBeenCalledWith('roomID1');
            });

            it('should call cloak.stop if response is false', () => {
                cloakConfig.messages.allowedToJoin(false);

                expect(window.cloak.stop).toHaveBeenCalled();
            })

            it('should call router.navigateToLobby if response is false', () => {
                cloakConfig.messages.allowedToJoin(false);

                expect(router.navigateToLobby).toHaveBeenCalled();
            });
        });

        describe('startSubmission response', () => {
            let startSubmission;
            beforeEach(() => {
                startSubmission = jasmine.createSpy('startSubmission');
                rewire('startSubmission', startSubmission);
            });

            afterEach(() => {
                resetDependency('startSubmission');
            });

            it('should call startSubmission with the time', () => {
                const time = 20;
                startSubmission.and.callFake(timeArg => timeArg);

                cloakConfig.messages.startSubmission(time);

                expect(startSubmission).toHaveBeenCalledWith(time);
            });

            it('should dispatch the result of calling startSubmission with the time', () => {
                const time = 20;
                startSubmission.and.callFake(timeArg => timeArg);

                cloakConfig.messages.startSubmission(time);

                expect(dispatch).toHaveBeenCalledWith(time);
            })
        });

        describe('stopSubmission response', () => {
            let stopSubmission;
            beforeEach(() => {
                stopSubmission = jasmine.createSpy('stopSubmission');
                rewire('stopSubmission', stopSubmission);
            });

            afterEach(() => {
                resetDependency('stopSubmission');
            });

            it('should call stopSubmission', () => {
                cloakConfig.messages.stopSubmission();

                expect(stopSubmission).toHaveBeenCalled();
            });

            it('should dispatch the result of calling stopSubmission', () => {
                cloakConfig.messages.stopSubmission();

                expect(dispatch).toHaveBeenCalled();
            });
        });

        describe('submittedAnswers response', () => {
            let submittedAnswers;
            beforeEach(() => {
                submittedAnswers = jasmine.createSpy('submittedAnswers');
                rewire('submittedAnswers', submittedAnswers);
            });

            afterEach(() => {
                resetDependency('submittedAnswers');
            });

            it('should call submittedAnswers with the answerList', () => {
                const answerList = ['answer1', 'answer2', 'answer3', 'answer4', 'answer5'];
                submittedAnswers.and.callFake(answerListArg => answerListArg);

                cloakConfig.messages.submittedAnswers(answerList);

                expect(submittedAnswers).toHaveBeenCalledWith(answerList);
            });

            it('should dispatch the result of calling submittedAnswers with the answerList', () => {
                const answerList = ['answer1', 'answer2', 'answer3', 'answer4', 'answer5'];
                submittedAnswers.and.callFake(answerListArg => answerListArg);

                cloakConfig.messages.submittedAnswers(answerList);

                expect(dispatch).toHaveBeenCalledWith(answerList);
            })
        });

        describe('roundEnded response', () => {
            let roundEnded;
            beforeEach(() => {
                roundEnded = jasmine.createSpy('roundEnded');
                rewire('roundEnded', roundEnded);
            });

            afterEach(() => {
                resetDependency('roundEnded');
            });

            it('should call roundEnded', () => {
                cloakConfig.messages.roundEnded();

                expect(roundEnded).toHaveBeenCalled();
            });

            it('should dispatch the result of calling roundEnded', () => {
                cloakConfig.messages.roundEnded();

                expect(dispatch).toHaveBeenCalled();
            });
        });

        describe('roundStarted response', () => {
            let roundStarted;
            beforeEach(() => {
                roundStarted = jasmine.createSpy('roundStarted');
                rewire('roundStarted', roundStarted);
            });

            afterEach(() => {
                resetDependency('roundStarted');
            });

            it('should call roundStarted', () => {
                cloakConfig.messages.roundStarted();

                expect(roundStarted).toHaveBeenCalled();
            });

            it('should dispatch the result of calling roundStarted', () => {
                cloakConfig.messages.roundStarted();

                expect(dispatch).toHaveBeenCalled();
            });
        });

        describe('resetRound response', () => {
            let resetRound;
            beforeEach(() => {
                resetRound = jasmine.createSpy('resetRound');
                rewire('resetRound', resetRound);
            });

            afterEach(() => {
                resetDependency('resetRound');
            });

            it('should call resetRound', () => {
                cloakConfig.messages.resetRound();

                expect(resetRound).toHaveBeenCalled();
            });

            it('should dispatch the result of calling resetRound', () => {
                cloakConfig.messages.resetRound();

                expect(dispatch).toHaveBeenCalled();
            });
        });

        describe('resetFinished response', () => {
            let resetFinished;
            beforeEach(() => {
                resetFinished = jasmine.createSpy('resetFinished');
                rewire('resetFinished', resetFinished);
            });

            afterEach(() => {
                resetDependency('resetFinished');
            });

            it('should call resetFinished', () => {
                cloakConfig.messages.resetFinished();

                expect(resetFinished).toHaveBeenCalled();
            });

            it('should dispatch the result of calling resetFinished', () => {
                cloakConfig.messages.resetFinished();

                expect(dispatch).toHaveBeenCalled();
            });
        });

        describe('initialGameParams response', () => {
            let gameParameters;
            beforeEach(() => {
                gameParameters = jasmine.createSpy('gameParameters');
                rewire('gameParameters', gameParameters);
            });

            afterEach(() => {
                resetDependency('gameParameters');
            });

            it('should call gameParameters with the parameters', () => {
                const params = {
                    answerTime: 12,
                    submitTime: 5
                };
                gameParameters.and.callFake(paramsArg => paramsArg);

                cloakConfig.messages.initialGameParams(params);

                expect(gameParameters).toHaveBeenCalledWith(params);
            });

            it('should dispatch the result of calling gameParameters with the parameters', () => {
                const params = {
                    answerTime: 12,
                    submitTime: 5
                };
                gameParameters.and.callFake(answerListArg => answerListArg);

                cloakConfig.messages.initialGameParams(params);

                expect(dispatch).toHaveBeenCalledWith(params);
            });
        });
    });

    describe('initialData', () => {
        let storageService;
        beforeEach(() => {
            storageService = jasmine.createSpyObj('storageService', ['getUser']);
            rewire('storageService', storageService);
        });

        afterEach(() => {
            resetDependency('storageService');
        });

        it('gets the name and id from the storage storageService', () => {
            storageService.getUser.and.callFake();
            storageService.getUser.and.returnValue({
                name: 'fakeUser',
                id: 'fakeId1'
            });
            cloakService.configureAndRun();

            expect(cloakConfig.initialData).toEqual({
                name: 'fakeUser',
                id: 'fakeId1',
                score: undefined
            });
        });
    });

    describe('exports', () => {
        it('messages the server setUsername when messageSetUsername is called', () => {
            cloakService.messageSetUsername('someone');

            expect(window.cloak.message).toHaveBeenCalledWith('setUsername', 'someone');
        });

        it('messages the server createRoom when messageCreateRoom is called', () => {
            cloakService.messageCreateRoom('room1');

            expect(window.cloak.message).toHaveBeenCalledWith('createRoom', 'room1');
        });

        it('messages the server joinRoom when messageJoinRoom is called', () => {
            cloakService.messageJoinRoom('roomId1');

            expect(window.cloak.message).toHaveBeenCalledWith('joinRoom', 'roomId1');
        });

        it('messages the server leaveRoom when messageLeaveRoom is called', () => {
            cloakService.messageLeaveRoom();

            expect(window.cloak.message).toHaveBeenCalledWith('leaveRoom');
        });

        it('checks with the server wether the connection is still live if isConnected is called', () => {
            cloakService.isConnected();

            expect(window.cloak.connected).toHaveBeenCalled();
        });

        it('messages the server roomDetails when getRoomData is called', () => {
            cloakService.getRoomData('roomId1');

            expect(window.cloak.message).toHaveBeenCalledWith('roomDetails', 'roomId1');
        });

        it('messages the server startGame when messageStartGame is called', () => {
            cloakService.messageStartGame();

            expect(window.cloak.message).toHaveBeenCalledWith('startGame');
        });

        it('messages the server getConsonant when messageGetConsonant is called', () => {
            cloakService.messageGetConsonant();

            expect(window.cloak.message).toHaveBeenCalledWith('getConsonant');
        });

        it('messages the server getVowel when messageGetVowel is called', () => {
            cloakService.messageGetVowel();

            expect(window.cloak.message).toHaveBeenCalledWith('getVowel');
        });

        it('messages the server removeFromRoomList when messageRemoveFromRoomList is called', () => {
            cloakService.messageRemoveFromRoomList('roomId1');

            expect(window.cloak.message).toHaveBeenCalledWith('removeFromRoomList', 'roomId1');
        });

        it('messages the server resetScore when resetScore is called', () => {
            cloakService.resetScore();

            expect(window.cloak.message).toHaveBeenCalledWith('resetScore');
        });

        it('messages the server possibleAnswers when messageAnswers is called', () => {
            cloakService.messageAnswers(['answer1', 'answer2', 'answer3', 'answer4', 'answer5']);

            expect(window.cloak.message).toHaveBeenCalledWith('possibleAnswers', ['answer1', 'answer2', 'answer3', 'answer4', 'answer5']);
        });

        it('messages the server submitAnswer when messageAnswerToSubmit is called', () => {
            cloakService.messageAnswerToSubmit(7);

            expect(window.cloak.message).toHaveBeenCalledWith('submitAnswer', 7);
        });
    });
});
