import axios from 'axios';
import { setAlert } from './alert';
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
} from './types';



export const searchTopics = (search) => async dispatch => {
    try {
        const res = await axios.get(`/topic/${search}`);

        dispatch({
            type: SEARCH_TOPICS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: TOPIC_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const getTopicsPUB = () => async dispatch => {
    try {
        const res = await axios.get(`/topic/getTopics`);
        

        dispatch({
            type: GET_TOPICS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: TOPIC_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const getUnapprovedTopics = () => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.post(`/topic/gettopics/unapproved`, config);

        dispatch({
            type: GET_UNAPPROVED_TOPICS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: TOPIC_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}



export const getapprovedTopics = () => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.post(`/topic/approved`, config);

        dispatch({
            type: GET_APPROVED_TOPICS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: TOPIC_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const approveTopic = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ id });
    try {
        const res = await axios.put(`/topic/approve`, body, config);

        dispatch({
            type: TOPIC_APPROVED,
            payload: res.data
        });
        dispatch(setAlert('Topic Approved', 'seccess'));
    } catch (err) {
        dispatch({
            type: TOPIC_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const disApproveTopic = (id) => async dispatch => {
    try {
        const res = await axios.put(`/topic/disapprove/${id}`);

        dispatch({
            type: TOPIC_DISAPPROVED,
            payload: res.data
        });
        dispatch(setAlert('Topic Disapproved', 'seccess'));
    } catch (err) {
        dispatch({
            type: TOPIC_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// data: name, type
export const createTopic = (name, type) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ name, type });
    try {
        const res = await axios.post(`/topic/createTopic`, body, config);

        dispatch({
            type: TOPIC_CREATED,
            payload: res.data
        });
        dispatch(setAlert('Topic Created', 'seccess'));
    } catch (err) {
        dispatch({
            type: TOPIC_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const getMyTopic = () => async dispatch => {
    try {
        const res = await axios.get(`/topic/getTopics/myTopics`);
        
        console.log(res.data)
        dispatch({
            type: GET_TOPICS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: TOPIC_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


// data: name, type
export const editTopic = (id, formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.put(`/topic/editTopic/${id}`, formData, config);

        dispatch({
            type: TOPIC_EDITED,
            payload: res.data
        });
        dispatch(setAlert('Topic Edited', 'seccess'));
    } catch (err) {
        dispatch({
            type: TOPIC_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const deleteTopic = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ id });
    try {
        const res = await axios.post(`/topic/deleteTopic`, body, config);

        dispatch({
            type: TOPIC_DELETED,
            payload: res.data
        });
        dispatch(setAlert('Topic Deleted', 'danger'));
    } catch (err) {
        dispatch({
            type: TOPIC_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}
