import {
    SEARCH, SEARCH_GROUPS, SEARCH_ERROR, 
    USER_DELETED,
    USER_DELETE_FAILED
} from '../actions/types';


const initialState = {
    search: [],
    searchgroups: [],
    loading: true,
    error: {}
};


export default function func(state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case SEARCH:
            return {
                ...state,
                search: [...payload],
                loading: false
            };
        case USER_DELETED:
            return {
                ...state,
                search: state.search.filter(user => user._id !== payload),
                loading: false
            };
        case SEARCH_GROUPS:
            return {
                ...state,
                searchgroups: [...state.searchgroups, ...payload],
                loading: false
            };
        case SEARCH_ERROR:
        case USER_DELETE_FAILED:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    };
};