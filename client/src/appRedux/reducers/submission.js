import {
    SET_SUBMISSION,
    GET_SUBMITTED_REPORTS,
    GET_LATE_SUBMITTED_REPORTS,
    ASSIGNMENT_ERROR
} from '../actions/types';

const initialState = {
    submission: [],
    reports: [],
    loading: true,
    error: {}
};


export default function func(state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case SET_SUBMISSION:
            return {
                ...state,
                submission: [...payload],
                loading: false
            };
        case GET_LATE_SUBMITTED_REPORTS:
        case GET_SUBMITTED_REPORTS:
            return {
                ...state,
                reports: [...payload],
                loading: false
            };
        case ASSIGNMENT_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    };
};