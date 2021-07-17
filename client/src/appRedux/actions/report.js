import axios from 'axios';
import { setAlert } from './alert';
import {
    SUBMIT_REPORT,
    DOWNLOAD_REPORT,
    DELETE_REPORT,
    REPORT_ERROR
} from './types';


// data: file
export const submitReport = (id, file) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.post(`/report/${id}`, file, config);

        dispatch({
            type: SUBMIT_REPORT,
            payload: res.data
        });
        dispatch(setAlert('Report Submitted', 'seccess'));
    } catch (err) {
        dispatch({
            type: REPORT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const downloadReport = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.get(`/reportdownload/${id}`, file, config);

        dispatch({
            type: DOWNLOAD_REPORT,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: REPORT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const deleteReport = (id) => async dispatch => {
    try {
        const res = await axios.delete(`/reportdelete/${id}`);

        dispatch({
            type: DELETE_REPORT,
            payload: res.data
        });
        dispatch(setAlert('Report Deleted', 'seccess'));
    } catch (err) {
        dispatch({
            type: REPORT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}
