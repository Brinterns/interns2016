var mockery = require('mockery');
var roundResetService;
describe('roundResetService', () => {
    var room;
    var roomDataService;
    var leaderService;
    beforeEach(() => {
        room = jasmine.createSpyObj('room', ['messageMembers', 'getMembers']);
        roomDataService = jasmine.createSpyObj('roomDataService', ['newRoundData']);
        leaderService = jasmine.createSpyObj('leaderService', ['setNextLeader', 'makeLeader']);
        jasmine.clock().install();
    });

    beforeEach(() => {
        mockery.enable({ useCleanCache: true });
    });

    beforeEach(()=> {
        mockery.registerMock('./room-data-service', roomDataService);
        mockery.registerMock('./leader-service', leaderService);
    });

    beforeEach(()=>{
        roundResetService = require('./round-reset-service');
    });

    afterEach(() => {
        mockery.deregisterAll();
    });

    afterEach(() => {
        mockery.disable();
        jasmine.clock().uninstall();
    })

    it('calls leaderService setNextLeader after 7 seconds with room', () => {
        let data = {
            rounds: []
        }
        leaderService.setNextLeader.and.callFake(()=>{});
        roomDataService.newRoundData.and.callFake(()=>data);

        roundResetService.startRoundResetTimer(room);
        jasmine.clock().tick(7001);

        expect(leaderService.setNextLeader).toHaveBeenCalledWith(room);
    })

    it('calls roomDataService newRoundData after 7 seconds with the roomData', () => {
        let data = {
            rounds: []
        };
        room.data = {
            answering: true,
            submission: false,
            rounds: ['L', 'N', 'N', 'N', 'L']
        };
        leaderService.setNextLeader.and.callFake(()=>{});
        roomDataService.newRoundData.and.callFake(()=>data);

        roundResetService.startRoundResetTimer(room);
        jasmine.clock().tick(7001);

        expect(roomDataService.newRoundData).toHaveBeenCalledWith({
            answering: true,
            submission: false,
            rounds: ['L', 'N', 'N', 'N', 'L']
        });
    });

    it('messages room members that game finished after 7 seconds if data.rounds is empty', () => {
        let data = {
            rounds: []
        };
        room.data = {
            rounds: ['L', 'N', 'N', 'N', 'L']
        };
        leaderService.setNextLeader.and.callFake(()=>{});
        roomDataService.newRoundData.and.callFake(()=>data);

        roundResetService.startRoundResetTimer(room);
        jasmine.clock().tick(7001);

        expect(room.messageMembers).toHaveBeenCalledWith('gameFinished');
    });

    describe('data.rounds is not empty', () => {
        it('sends nextRoundType to all users in the room as well as the string of the round type', () => {
            let data = {
                rounds: ['L', 'N', 'N', 'N']
            };
            room.data = {
                rounds: ['L', 'N', 'N', 'N', 'L']
            };
            leaderService.setNextLeader.and.callFake(()=>{});
            roomDataService.newRoundData.and.callFake(()=>data);

            roundResetService.startRoundResetTimer(room);
            jasmine.clock().tick(7001);

            expect(room.messageMembers).toHaveBeenCalledWith('nextRoundType', 'L');
        });

        it('sends resetRound to all users in the room', () => {
            let data = {
                rounds: ['L', 'N', 'N', 'N']
            };
            room.data = {
                rounds: ['L', 'N', 'N', 'N', 'L']
            };
            leaderService.setNextLeader.and.callFake(()=>{});
            roomDataService.newRoundData.and.callFake(()=>data);

            roundResetService.startRoundResetTimer(room);
            jasmine.clock().tick(7001);

            expect(room.messageMembers).toHaveBeenCalledWith('resetRound');
        });

        it('sends resetFinished to all users in the room after 2 more seconds', () => {
            let data = {
                rounds: ['L', 'N', 'N', 'N']
            };
            room.data = {
                rounds: ['L', 'N', 'N', 'N', 'L']
            };
            leaderService.setNextLeader.and.callFake(()=>{});
            roomDataService.newRoundData.and.callFake(()=>data);

            roundResetService.startRoundResetTimer(room);
            jasmine.clock().tick(7001);
            jasmine.clock().tick(2000);

            expect(room.messageMembers).toHaveBeenCalledWith('resetFinished');
        });
    });
});
