import {
    GET_NULL_USERS,
    ROLE_ASSIGNED,
    STUDENT_JOINED_GRORUP,
    STUDENT_REMOVED_FROM_GROUP,
    USERS_ERROR,
    EXCEL_GENERATED,
    GENERATE_ERROR,
    SYSTEM_FILES_DOWNLOADED,
    DOWNLOAD_ERROR
} from '../actions/types';

const initialState = {
    users: [],
    group: null,
    excel: null,
    files: [],
    loading: true,
    error: {}
};


export default function func(state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case GET_NULL_USERS:
            return {
                ...state,
                users: [...payload],
                loading: false
            };
        case ROLE_ASSIGNED:
            return {
                ...state,
                loading: false
            };
        case STUDENT_JOINED_GRORUP:
            return {
                ...state,
                groups: payload,
                loading: false
            };
        case STUDENT_REMOVED_FROM_GROUP:
            return {
                ...state,
                groups: null,
                loading: false
            };
        case EXCEL_GENERATED:
            return {
                ...state,
                excel: [payload],
                loading: false
            };
        case SYSTEM_FILES_DOWNLOADED:
            return {
                ...state,
                loading: false
            };
        case USERS_ERROR:
        case GENERATE_ERROR:
        case DOWNLOAD_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    };
};