import {
    SUBMIT_REPORT,
    DOWNLOAD_REPORT,
    DELETE_REPORT,
    REPORT_ERROR
} from '../actions/types';

const initialState = {
    reports: [],
    loading: true,
    error: {}
};


export default function func(state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case SUBMIT_REPORT:
        case DOWNLOAD_REPORT:
            return {
                ...state,
                reports: [...payload],
                loading: false
            };
        case DELETE_REPORT:
            return {
                ...state,
                reports: state.reports.filter(report => report._id !== payload),
                loading: false
            };
        case REPORT_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    };
};