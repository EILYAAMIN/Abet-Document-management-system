import {
    SEARCH_TOPICS,
    GET_UNAPPROVED_TOPICS,
    GET_APPROVED_TOPICS,
    TOPIC_APPROVED,
    TOPIC_DISAPPROVED,
    TOPIC_CREATED,
    GET_TOPICS,
    TOPIC_EDITED,
    TOPIC_DELETED,
    TOPIC_ERROR
} from '../actions/types';

const initialState = {
    topics: [],
    unapprovedtopics: [],
    loading: true,
    error: {}
};


export default function func(state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case SEARCH_TOPICS:
        case GET_APPROVED_TOPICS:
        case GET_TOPICS:
        case TOPIC_EDITED:
            return {
                ...state,
                topics: [...payload],
                loading: false
            };
        case TOPIC_APPROVED:
            return {
                ...state,
                topics: [payload],
                unapprovedtopics: state.unapprovedtopics.filter(tpc => tpc._id !== payload),
                loading: false
            };
        case TOPIC_DISAPPROVED:
            return {
                ...state,
                topics: [payload],
                unapprovedtopics: [...state.unapprovedtopics, payload],
                loading: false
            };
        case GET_UNAPPROVED_TOPICS:
            return {
                ...state,
                unapprovedtopics: [...payload],
                loading: false
            };
        case TOPIC_CREATED:
            return {
                topics: [...state.topics, payload],
                loading: false
            };
        case TOPIC_DELETED:
            return {
                ...state,
                topics: state.topics.filter(tpc => tpc._id !== payload),
                loading: false
            };
        case TOPIC_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    };
};