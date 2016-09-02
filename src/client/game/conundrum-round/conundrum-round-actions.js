export const SET_CONUNDRUM = 'SET_CONUNDRUM';
export const CORRECT_ANAGRAM = 'CORRECT_ANAGRAM'

export function setConundrum(conundrum) {
    return {
        type: SET_CONUNDRUM,
        payload: conundrum
    }
}

export function correctAnagram(results) {
    return {
        type: CORRECT_ANAGRAM,
        payload: results
    }
}
