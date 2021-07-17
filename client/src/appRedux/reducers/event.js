import {
    GET_SESSIONS, GET_SESSION, GET_SESSION_GROUPS, EVALUATED,
    SET_MEETING, EDIT_MEETING, DELETE_MEETING,
    SET_SESSION, EDIT_SESSION, DELETE_SESSION, MEETING_ERROR, SESSION_ERROR, EVALUATE_ERROR, EVENT_ERROR, GET_RUBRICS,
    RUBRICS_ERROR, GET_STUDENT, GET_GROUP, GET_GROUP_ERROR, GET_CRITERIA, GET_CRITERIA_ERROR,
    GET_STUDENT_ERROR, DOWNLOAD_EVALUATION,
    DOWNLOAD_EVALUATION_ERROR, CHECK_EVALUATED,
    CHECK_EVALUATION_ERROR, SESSION_OUTCOME_GENERATED,
    OUTCOME_GENERATION_FAIL, OUTCOME_DOWNLOADED,
    OUTCOME_DOWNLOAD_FAILED,
    OUTCOME_DELETED,
    OUTCOME_DELETE_FAILED,
    IS_GENERATED_CHECK,
    IS_GENERATED_CHECK_FAILED,
    EVALUATION_DELETED,
    EVALUATION_DELETE_FAILED
} from '../actions/types';

const initialState = {
    sessions: [],
    meetings: [],
    rubrics: [],
    criteria: [],
    session: null,
    meeting: null,
    student: null,
    generated: [],
    group: null,
    evaluated: [],
    loading: true,
    error: {}
};


export default function func(state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case GET_SESSIONS:
            return {
                ...state,
                sessions: [...payload],
                loading: false
            };
        case GET_RUBRICS:
            return {
                ...state,
                rubrics: payload,
                loading: false
            };
        case GET_CRITERIA:
            return {
                ...state,
                criteria: payload,
                loading: false
            };
        case GET_SESSION:
            return {
                ...state,
                session: payload,
                loading: false
            };
        case EVALUATED:
        case DOWNLOAD_EVALUATION:
        case OUTCOME_DOWNLOADED:
        case GET_SESSION_GROUPS:
            return {
                ...state,
                loading: false
            };
        case GET_STUDENT:
            return {
                ...state,
                student: payload,
                loading: false
            };
        case GET_GROUP:
            return {
                ...state,
                group: payload,
                loading: false
            };
        case SET_MEETING:
        case EDIT_MEETING:
            return {
                ...state,
                meetings: [...payload],
                loading: false
            };
        case DELETE_MEETING:
            return {
                ...state,
                meetings: state.meetings.filter(meetings => meetings._id !== payload),
                loading: false
            };
        case OUTCOME_DELETED:
            return {
                ...state,
                generated: state.generated.filter(generated => generated !== payload),
                loading: false
            };
        case SET_SESSION:
        case EDIT_SESSION:
            return {
                ...state,
                session: payload,
                loading: false
            };
        case DELETE_SESSION:
            return {
                ...state,
                sessions: state.sessions.filter(session => session._id !== payload),
                loading: false
            };
        case EVALUATION_DELETED:
            return {
                ...state,
                evaluated: state.evaluated.filter(evaluated => evaluated._id !== payload),
                loading: false
            };
        case CHECK_EVALUATED:
            return {
                ...state,
                evaluated: [...payload],
                loading: false
            };
        case SESSION_OUTCOME_GENERATED:
            return {
                ...state,
                generated: [...state.generated, payload],
                loading: false
            };
        case IS_GENERATED_CHECK:
            return {
                ...state,
                generated: [...payload],
                loading: false
            };
        case EVALUATION_DELETE_FAILED:
        case OUTCOME_GENERATION_FAIL:
        case IS_GENERATED_CHECK_FAILED:
        case MEETING_ERROR:
        case SESSION_ERROR:
        case EVALUATE_ERROR:
        case RUBRICS_ERROR:
        case EVENT_ERROR:
        case GET_GROUP_ERROR:
        case GET_CRITERIA_ERROR:
        case GET_STUDENT_ERROR:
        case DOWNLOAD_EVALUATION_ERROR:
        case CHECK_EVALUATION_ERROR:
        case OUTCOME_DOWNLOAD_FAILED:
        case OUTCOME_DELETE_FAILED:
            return {
                ...state,
                error: payload,
                loading: false
            };

        default:
            return state;
    };
};