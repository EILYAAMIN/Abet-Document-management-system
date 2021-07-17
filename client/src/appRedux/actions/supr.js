import axios from 'axios';
import { setAlert } from './alert';
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
} from './types';


// data: file
export const getNullRoleUsers = () => async dispatch => {
    try {
        const res = await axios.get(`/super/`);

        dispatch({
            type: GET_NULL_USERS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: USERS_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// formData: role
export const assignRole = (id, role) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ role });
    try {
        const res = await axios.post(`/super/roleSet/${id}`, body, config);

        dispatch({
            type: ROLE_ASSIGNED,
            payload: res.data
        });
        dispatch(setAlert('Role Assigned', 'seccess'));
    } catch (err) {
        dispatch({
            type: USERS_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// formData: student, group
export const addStudentToGroup = (formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.post(`/super/addStudent`, formData, config);

        dispatch({
            type: STUDENT_JOINED_GRORUP,
            payload: res.data
        });
        dispatch(setAlert('Student Added', 'seccess'));
    } catch (err) {
        dispatch({
            type: USERS_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// formData: student, group
export const removeStudentFromGroup = (formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.post(`/super/removeMember`, formData, config);

        dispatch({
            type: STUDENT_REMOVED_FROM_GROUP,
            payload: res.data
        });
        dispatch(setAlert('Student Removed', 'seccess'));
    } catch (err) {
        dispatch({
            type: USERS_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// formData: coursetag
export const generateExcel = (coursetag) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ coursetag });

    try {
        const res = await axios.post(`/super/generate`, body, config);

        dispatch({
            type: EXCEL_GENERATED,
            payload: res.data
        });
        dispatch(setAlert(`Excel file generated`, 'seccess'));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: GENERATE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const downloadFiles = () => async dispatch => {
    const config = {
        headers: {
            "Authorization": "Bearer " + process.env.key,
            "Content-Type": "multipart/form-data",
            "Content-Disposition": "attachment"
        },
        responseType: 'blob',
    };

    try {
        await axios.get(`/super/download`, config).then((response) => {
            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `SemesterFiles.zip`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });

        dispatch({
            type: SYSTEM_FILES_DOWNLOADED
        });
    } catch (err) {
        dispatch({
            type: DOWNLOAD_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


