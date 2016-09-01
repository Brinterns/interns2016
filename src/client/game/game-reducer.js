import * as actionTypes from './game-actions';
import * as letterRoundActions from './letters-round/letter-round-actions';
import * as numberRoundActions from './numbers-round/number-round-actions';

import { updateState } from '../utils/util';

const initialState = {
	started: false,
    leader: {
        id: null,
        name: null
    },
    letterList: [],
    disableConsonant: false,
    disableVowel: false,
    answerTimerValue: null,
    submissionTimerValue: null,
    disableStart: true,
    answering: false,
    submission: false,
    roundResults: false,
    finalAnswers: [],
    resetRound: false,
    gameParams: {},
    gameFinished: false,
    nextRoundType: '',
    randomNumber: null,
    progressBarVisible: false,
    disableLarge: false,
    disableSmall: false,
    numberList: [],
    sendEquation: false,
    bestAnswer: null
};

const game = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REINITIALISE_STATE: 
            return initialState;
        case actionTypes.START_GAME:
            return updateState(state, {
                started: true,
                disableStart: true
            });
        case actionTypes.LEAVE_GAME:
            return updateState(state, {
                started: false,
                letterList: [],
                disableConsonant: false,
                disableVowel: false,
                answering: false,
                numberList: [],
                disableLarge: false,
                disableSmall: false,
                sendEquation: false,
                randomNumber: null,
                gameFinished: false
            });
        case actionTypes.SET_LEADER:
            return updateState(state, {
                leader: {
                    id: action.payload.id,
                    name: action.payload.name
                },
                disableConsonant: action.payload.disableConsonant,
                disableVowel: action.payload.disableVowel
            });
        case actionTypes.DISABLE_START:
            return updateState(state, {
                disableStart: action.payload
            });
        case actionTypes.ROUND_STARTED:
            return updateState(state, {
                roundResults: false
            });
        case actionTypes.ROUND_ENDED:
            return updateState(state, {
                roundResults: true
            });
        case actionTypes.RESET_ROUND:
            return updateState(state, {
                letterList: [],
                answerTimerValue: null,
                submissionTimerValue: null,
                answering: false,
                submission: false,
                roundResults: false,
                finalAnswers: [],
                resetRound: true,
                randomNumber: null,
                numberList: [],
                sendEquation: false,
                disableConsonant: true,
                disableVowel: true,
                disableLarge: true,
                disableSmall: true
            });
        case actionTypes.RESET_FINISHED: {
            return updateState(state, {
                resetRound: false,
                disableConsonant: false,
                disableVowel: false,
                disableLarge: false,
                disableSmall: false
            });
        }
        case actionTypes.GAME_PARAMETERS:{
            return updateState(state,{
                gameParams: action.payload
            });
        }
        case actionTypes.GAME_FINISHED: {
            return updateState(state, {
                gameFinished: true
            });
        }
        case actionTypes.NEXT_ROUND_TYPE: {
            return updateState(state, {
                nextRoundType: action.payload
            });
        }
        case letterRoundActions.GET_CONSONANT:
            return updateState(state, {
                letterList: [...state.letterList, action.payload]
            });
        case letterRoundActions.GET_VOWEL:
            return updateState(state, {
                letterList: [...state.letterList, action.payload]
            });
        case letterRoundActions.DISABLE_CONSONANT:
            return updateState(state, {
                disableConsonant: action.payload
            });
        case letterRoundActions.DISABLE_VOWEL:
            return updateState(state, {
                disableVowel: action.payload
            });
        case letterRoundActions.START_ANSWERING:
            return updateState(state, {
                answering: true,
                answerTimerValue: action.payload
            });
        case letterRoundActions.STOP_ANSWERING:
            return updateState(state, {
                answering: false
            });
        case letterRoundActions.START_SUBMISSION:
            return updateState(state, {
                submission: true,
                submissionTimerValue: action.payload,
                progressBarVisible: true
            });
        case letterRoundActions.STOP_SUBMISSION:
            return updateState(state, {
                submission: false
            });
        case letterRoundActions.SUBMITTED_ANSWERS:
            return updateState(state, {
                progressBarVisible: false,
                finalAnswers: action.payload
            });
        case letterRoundActions.SET_BEST_ANSWER: {
            return updateState(state, {
                bestAnswer: action.payload
            });
        }
        case letterRoundActions.ANSWER_TIMER_TICK:
            return updateState(state, {
                answerTimerValue: state.answerTimerValue-1
            });
        case letterRoundActions.SUBMISSION_TIMER_TICK:
            return updateState(state, {
                submissionTimerValue: state.submissionTimerValue-1
            });
        case letterRoundActions.RESET_ANSWER_TIMER:
            return updateState(state, {
                answerTimerValue: null
            });
        case letterRoundActions.RESET_SUBMISSION_TIMER:
            return updateState(state, {
                submissionTimerValue: null
            });
        case letterRoundActions.RESET_LETTERS:
            return updateState(state, {
                letterList: action.payload
            });
        case numberRoundActions.SET_RANDOM_NUMBER: {
            return updateState(state, {
                randomNumber: action.payload
            });
        }
        case numberRoundActions.GET_LARGE: {
            return updateState(state, {
                numberList: [...state.numberList, action.payload]
            });
        }
        case numberRoundActions.GET_SMALL: {
            return updateState(state, {
                numberList: [...state.numberList, action.payload]
            });
        }
        case numberRoundActions.DISABLE_LARGE: {
            return updateState(state, {
                disableLarge: true
            });
        }
        case numberRoundActions.DISABLE_SMALL: {
            return updateState(state, {
                disableSmall: true
            });
        }
        case numberRoundActions.GET_EQUATION: {
            return updateState(state, {
                sendEquation: true
            })
        }
        default:
            return state;
    }
};

export default game;
