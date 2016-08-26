var numbersRound = require('./numbers-round');

var min = 1;
var max = 1000;

describe('Numbers Round', () => {
    let room;
    let user;
    beforeEach(() => {
        user = jasmine.createSpyObj('user', ['getRoom']);
        room = jasmine.createSpyObj('room', ['messageMembers']);
    })
    it('messages all room members with a random number', () => {
        room.data = {
            numbersRound: {}
        };
        user.getRoom.and.returnValue(room);

        numbersRound.getRandomNumber(room);

        expect(room.messageMembers).toHaveBeenCalled();
    });

    it('generates a random number in the supplied range', () => {
        var randomNumber = numbersRound.generateRandomNumber(min, max);

        expect(randomNumber).toBeGreaterThan(min);
        expect(randomNumber).toBeLessThan(max);
    });
});
