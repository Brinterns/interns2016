import lobby from './lobby-reducer';

describe('lobby reducer tests', () => {
    let state;
    beforeEach(() => {
        state = {
        	rooms: [],
        	users: [],
            roundTypes: {},
            letterSlider: 5,
            numberSlider: 5
        };
    });

    describe('UPDATE_ROOM_LIST', () => {
        it('updates room list', () => {
            state = lobby(state, {
                type: 'UPDATE_ROOM_LIST',
                payload: ['room1', 'room2']
            });

            expect(state.rooms).toEqual(['room1', 'room2']);
        });
    });

    describe('UPDATE_LOBBY_LIST', () => {
        it('updates lobby list', () => {
            state = lobby(state, {
                type: 'UPDATE_LOBBY_LIST',
                payload: ['user1', 'user2']
            });

            expect(state.users).toEqual(['user1', 'user2']);
        });
    });


    describe('UPDATE_LETTER_SLIDER', () => {
        it('updates letter slider', () => {
            state = lobby(state, {
                type: 'UPDATE_LETTER_SLIDER',
                payload: 8
            });

            expect(state.letterSlider).toEqual(8);
        });
    });


    describe('UPDATE_NUMBER_SLIDER', () => {
        it('updates number slider', () => {
            state = lobby(state, {
                type: 'UPDATE_NUMBER_SLIDER',
                payload: 2
            });

            expect(state.numberSlider).toEqual(2);
        });
    });

    describe('ROUND_TYPES', () => {
        it('updates the number of letter rounds to 0 if letter rounds are disabled', () => {
            state = lobby(state, {
                type: 'ROUND_TYPES',
                payload: {
                    letters: false,
                    numbers: true
                }
            });

            expect(state.letterSlider).toEqual(0);
        });

        it('updates the number of number rounds to 0 if number rounds are disabled', () => {
            state = lobby(state, {
                type: 'ROUND_TYPES',
                payload: {
                    letters: true,
                    numbers: false
                }
            });

            expect(state.numberSlider).toEqual(0);
        });
    });
})
