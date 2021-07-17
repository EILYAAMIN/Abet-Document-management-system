import {
    GET_GROUPS,
    GET_AWAITING_GROUPS,
    APPROVE_GROUP,
    GROUP_ERROR,
    WITHDRAW_GROUP,
    CREATE_GROUP,
    EDIT_GROUP,
    DELETE_GROUP,
    GET_MY_GROUP,
    GET_MEMBER_REQUESTING_GROUPS,
    JOIN_REQUESTING_GROUP,
    CANCEL_GROUP_MEMBERSHIP,
} from "../actions/types";

const initialState = {
    groups: [],
    requests: [],
    loading: true,
    error: {},
};

export default function func(state = initialState, action) {
    const {
        type,
        payload
    } = action;

    switch (type) {
        case GET_GROUPS:
            return {
                ...state,
                groups: [...payload],
                loading: false,
            };
        case CREATE_GROUP:
        case EDIT_GROUP:
        case GET_MY_GROUP:
            return {
                ...state,
                groups: [payload],
                loading: false,
            };
        case GET_AWAITING_GROUPS:
        case GET_MEMBER_REQUESTING_GROUPS:
            return {
                ...state,
                requests: [...payload],
                loading: false
            };
        case APPROVE_GROUP:
        case JOIN_REQUESTING_GROUP:
        case WITHDRAW_GROUP:
        case DELETE_GROUP:
        case CANCEL_GROUP_MEMBERSHIP:
            return {
                ...state,
                loading: false,
            };
        case GROUP_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        default:
            return state;
    }
}