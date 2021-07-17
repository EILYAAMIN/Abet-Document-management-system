import axios from 'axios';
import { setAlert } from './alert';
import { SEARCH, SEARCH_GROUPS, SEARCH_ERROR, USER_DELETED, USER_DELETE_FAILED } from './types';

export const deleteUser = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ id });
    try {
        const res = await axios.post(`/general/delete`, body, config);

        dispatch({
            type: USER_DELETED,
            payload: res.data
        });
        dispatch(setAlert('User Deleted', 'danger'));
    } catch (err) {
        dispatch({
            type: USER_DELETE_FAILED,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const searchStudents = (search) => async dispatch => {
    try {
        const res = await axios.get(`/general/users/${search}`);

        dispatch({
            type: SEARCH,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: SEARCH_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const searchUsers = (search) => async dispatch => {
    try {
        const res = await axios.get(`/general/user/${search}`);

        dispatch({
            type: SEARCH,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: SEARCH_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const searchGroups = (search) => async dispatch => {
    try {
        const res = await axios.get(`/general/groups/${search}`);

        dispatch({
            type: SEARCH_GROUPS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: SEARCH_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}