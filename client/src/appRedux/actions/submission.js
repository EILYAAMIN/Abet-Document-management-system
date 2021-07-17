import axios from 'axios';
import { setAlert } from './alert';
import {
    SET_SUBMISSION,
    GET_SUBMITTED_REPORTS,
    GET_LATE_SUBMITTED_REPORTS,
    ASSIGNMENT_ERROR
} from './types';


// formData: year, month, day, hours, minutes, name, topic
export const setSubmission = (id, formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.post(`/submission/submission`, formData, config);

        dispatch({
            type: SET_SUBMISSION,
            payload: res.data
        });
        dispatch(setAlert('Submission set', 'seccess'));
    } catch (err) {
        dispatch({
            type: ASSIGNMENT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const getSubmittedReports = (id) => async dispatch => {
    try {
        const res = await axios.get(`/submission/reports/${id}`);

        dispatch({
            type: GET_SUBMITTED_REPORTS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: ASSIGNMENT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const getLateSubmittedReports = (id) => async dispatch => {
    try {
        const res = await axios.get(`/submission/latereports/${id}`);

        dispatch({
            type: GET_LATE_SUBMITTED_REPORTS,
            payload: res.data
        });
        
    } catch (err) {
        dispatch({
            type: ASSIGNMENT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}
