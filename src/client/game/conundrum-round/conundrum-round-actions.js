export const SET_CONUNDRUM = 'SET_CONUNDRUM';

export function setConundrum(conundrum) {
    return {
        type: SET_CONUNDRUM,
        payload: conundrum
    }
}
