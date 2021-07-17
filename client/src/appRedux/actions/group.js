import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_GROUPS,
    GET_AWAITING_GROUPS,
    APPROVE_GROUP,
    GROUP_ERROR,
    WITHDRAW_GROUP,
    CREATE_GROUP,
    GET_MY_GROUP,
    EDIT_GROUP,
    DELETE_GROUP,
    GET_MEMBER_REQUESTING_GROUPS,
    JOIN_REQUESTING_GROUP,
    CANCEL_GROUP_MEMBERSHIP
} from './types';


export const getMyGroups = () => async dispatch => {
    try {
        const res = await axios.get(`/group/mygroups`);

        dispatch({
            type: GET_GROUPS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: GROUP_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const getAwaitingGroups = () => async dispatch => {
    try {
        const res = await axios.get(`/group/unapproved-groups`);

        dispatch({
            type: GET_AWAITING_GROUPS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: GROUP_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const approveGroups = (id) => async dispatch => {
    try {
        const res = await axios.put(`/group/approve/${id}`);

        dispatch({
            type: APPROVE_GROUP,
            payload: res.data
        });
        dispatch(setAlert('Group Approved', 'seccess'));
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: GROUP_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const withdrawGroups = (id) => async dispatch => {
    try {
        const res = await axios.delete(`/group/remove/${id}`);

        dispatch({
            type: WITHDRAW_GROUP,
            payload: res.data
        });
        dispatch(setAlert('Group Declined', 'danger'));
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: GROUP_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// formData: topic, members
export const createGroup = (topic, members) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ topic, members });
    try {
        const res = await axios.post(`/group/create`, body, config);

        dispatch({
            type: CREATE_GROUP,
            payload: res.data
        });

        dispatch(setAlert('Group Created', 'seccess'));

    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: GROUP_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


// formData: topic, members
export const editGroup = (topic, members) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ topic, members });
    try {
        const res = await axios.put(`/group/edit`, body, config);

        dispatch({
            type: EDIT_GROUP,
            payload: res.data
        });
        dispatch(setAlert('Group Edited', 'seccess'));
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: GROUP_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const deleteGroup = () => async dispatch => {
    try {
        const res = await axios.delete(`/group/delete`);

        dispatch({
            type: DELETE_GROUP,
            payload: res.data
        });
        dispatch(setAlert('Group Deleted', 'danger'));
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: GROUP_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const getRequestingGroups = () => async dispatch => {
    try {
        const res = await axios.get(`/group/groupRequests`);

        dispatch({
            type: GET_MEMBER_REQUESTING_GROUPS,
            payload: res.data
        });

    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: GROUP_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const getCreatedGroup = () => async dispatch => {
    try {
        const res = await axios.get(`/group/createdGroup`);

        dispatch({
            type: GET_MY_GROUP,
            payload: res.data
        });

    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: GROUP_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}




export const approveGroup = (id) => async dispatch => {
    try {
        const res = await axios.put(`/group/mygroups/approve/${id}`);

        dispatch({
            type: JOIN_REQUESTING_GROUP,
            payload: res.data
        });
        dispatch(setAlert('Group Approved', 'seccess'));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: GROUP_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}



export const cancelGroup = (id) => async dispatch => {
    try {
        const res = await axios.put(`/group/mygroups/decline/${id}`);

        dispatch({
            type: CANCEL_GROUP_MEMBERSHIP,
            payload: res.data
        });
        dispatch(setAlert('Group Declined', 'danger'));
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: GROUP_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}
