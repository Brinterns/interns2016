import cloakService from './cloak-service.js';

const rewire = cloakService.__Rewire__.bind(cloakService.__Rewire__);
const resetDependency = cloakService.__ResetDependency__.bind(cloakService.__ResetDependency__);

describe('cloak service', () => {
    let cloakConfig;
    beforeEach(() => {
        window.cloak = jasmine.createSpyObj('cloak', ['configure', 'run', 'message', 'connected']);
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


    describe('messages', () => {
        let dispatch;
        beforeEach(() => {
            dispatch = jasmine.createSpy('dispatch');
            rewire('dispatch', dispatch);
        });

        afterEach(() => {
            resetDependency('dispatch');
        });

        describe('refreshLobby', () => {
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

        describe('roomDetailsResponse', () => {
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
    });
});
