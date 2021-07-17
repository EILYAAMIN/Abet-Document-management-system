import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_SESSIONS, GET_SESSION, GET_SESSION_GROUPS, EVALUATED,
    SET_MEETING, EDIT_MEETING, DELETE_MEETING,
    SET_SESSION, EDIT_SESSION, DELETE_SESSION, MEETING_ERROR, SESSION_ERROR, EVALUATE_ERROR, EVENT_ERROR, GET_RUBRICS,
    RUBRICS_ERROR, GET_STUDENT, GET_GROUP,
    GET_GROUP_ERROR, GET_CRITERIA,
    GET_CRITERIA_ERROR,
    GET_STUDENT_ERROR, DOWNLOAD_EVALUATION,
    DOWNLOAD_EVALUATION_ERROR,
    CHECK_EVALUATION_ERROR,
    CHECK_EVALUATED,
    SESSION_OUTCOME_GENERATED,
    OUTCOME_GENERATION_FAIL,
    OUTCOME_DOWNLOADED,
    OUTCOME_DOWNLOAD_FAILED,
    OUTCOME_DELETED,
    OUTCOME_DELETE_FAILED,
    IS_GENERATED_CHECK,
    IS_GENERATED_CHECK_FAILED,
    EVALUATION_DELETED,
    EVALUATION_DELETE_FAILED

} from './types';

export const getSessions = () => async dispatch => {
    try {
        const res = await axios.get("/event/sessions");

        dispatch({
            type: GET_SESSIONS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: EVENT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }

}

export const getSession = (id) => async dispatch => {
    try {
        const res = await axios.get(`/event/session/${id}`);

        dispatch({
            type: GET_SESSION,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: SESSION_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const getSessionGroups = (sessionId) => async dispatch => {
    try {
        const res = await axios.get(`/event/groups/${sessionId}`);

        dispatch({
            type: GET_SESSION_GROUPS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: SESSION_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// formData : group, message, date, location, time, subject
export const setMeeting = (formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.post(`/event/setMeeting`, formData, config);

        dispatch({
            type: SET_MEETING,
            payload: res.data
        });
        dispatch(setAlert('Meeting Set', 'seccess'));
    } catch (err) {
        dispatch({
            type: MEETING_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


// formData : message, date, location, time
export const editMeeting = (id, formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.put(`/event/editMeeting/${id}`, formData, config);

        dispatch({
            type: EDIT_MEETING,
            payload: res.data
        });
        dispatch(setAlert('Meeting Edited', 'seccess'));
    } catch (err) {
        dispatch({
            type: MEETING_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}



export const deleteMeeting = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.delete(`/event/deleteMeeting/${id}`, config);

        dispatch({
            type: DELETE_MEETING,
            payload: res.data
        });
        dispatch(setAlert('Meeting Deleted', 'seccess'));
    } catch (err) {
        dispatch({
            type: MEETING_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


// formData: chair, external, members, groups, message, date, location
export const setSession = (chair, external, members, groups, message, date, location) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ chair, external, members, groups, message, date, location });

    try {
        const res = await axios.post(`/event/setSession`, body, config);

        dispatch({
            type: SET_SESSION,
            payload: res.data
        });

        dispatch(setAlert('Session Set', 'seccess'));

    } catch (err) {

        dispatch({
            type: SESSION_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


// formData: chair, external, members, groups, message, date, location 
export const editSession = (id, formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.put(`/event/editSession/${id}`, formData, config);

        dispatch({
            type: EDIT_SESSION,
            payload: res.data
        });
        dispatch(setAlert('Session Edited', 'seccess'));
    } catch (err) {
        dispatch({
            type: SESSION_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}



export const deleteSession = (id) => async dispatch => {
    try {
        const res = await axios.delete(`/event/deleteSession/${id}`);

        dispatch({
            type: DELETE_SESSION,
            payload: res.data
        });
        dispatch(setAlert('Session Deleted', 'danger'));
    } catch (err) {
        dispatch({
            type: SESSION_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


// formData: code, ReportTableGrades, CoopGrades, QualityGrades, PresentGrades, originality
export const evaluate = (code, ReportTableGrades, CoopGrades, QualityGrades, PresentGrades, originality, sessionId, groupId, studentId) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (code.includes('CMPE406HW') || code.includes('BLGM406HW'))
        ReportTableGrades.pop();
    console.log(ReportTableGrades);

    const body = JSON.stringify({ code, ReportTableGrades, CoopGrades, QualityGrades, PresentGrades, originality });
    try {
        const res = await axios.post(`/event/${sessionId}/${groupId}/${studentId}`, body, config);

        dispatch({
            type: EVALUATED,
            payload: res.data
        });
        dispatch(setAlert('Evaluation Done', 'seccess'));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: EVALUATE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const getRubrics = (course, topic) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.post(`/event/rubrics/${course}/${topic}`, config);

        dispatch({
            type: GET_RUBRICS,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: RUBRICS_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const getCriteria = (course, topic) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.post(`/event/criteria/${course}/${topic}`, config);

        dispatch({
            type: GET_CRITERIA,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: GET_CRITERIA_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const getStudent = (id) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ id });
    try {
        const res = await axios.post(`/event/getstudent`, body, config);

        dispatch({
            type: GET_STUDENT,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: GET_STUDENT_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const getStudentGroup = (id) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ id });
    try {
        const res = await axios.post(`/event/getstudentgroup`, body, config);

        dispatch({
            type: GET_GROUP,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: GET_GROUP_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const downloadEvaluation = (id, student, studentnumber) => async dispatch => {

    const config = {
        headers: {
            "Authorization": "Bearer " + process.env.key,
            "Content-Type": "multipart/form-data",
            "Content-Disposition": "attachment"
        },
        responseType: 'blob',
    };

    const formData = new FormData();

    try {
        await axios.post(`/event/downloadEvaluation/${id}`, formData, config).then((response) => {
            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${student + studentnumber}.docx`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });

        dispatch({
            type: DOWNLOAD_EVALUATION
        });

    } catch (err) {
        dispatch({
            type: DOWNLOAD_EVALUATION_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const getEvaluated = () => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {

        const res = await axios.post(`/event/isEvaluated`, config);

        dispatch({
            type: CHECK_EVALUATED,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: CHECK_EVALUATION_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const generateOutcome = (session) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ session });

    try {

        const res = await axios.post(`/event/genAfterSession`, body, config);

        dispatch({
            type: SESSION_OUTCOME_GENERATED,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: OUTCOME_GENERATION_FAIL,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const downloadSessionOutcome = (session, chair, date) => async dispatch => {

    const config = {
        headers: {
            "Authorization": "Bearer " + process.env.key,
            "Content-Type": "multipart/form-data",
            "Content-Disposition": "attachment"
        },
        responseType: 'blob',
    };

    const formData = new FormData();

    try {
        await axios.post(`/event/downloadSessionOutcome/${session}`, formData, config).then((response) => {
            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${chair} ${date}.xlsx`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });

        dispatch({
            type: OUTCOME_DOWNLOADED
        });

    } catch (err) {
        dispatch({
            type: OUTCOME_DOWNLOAD_FAILED,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}


export const deleteSessionOutcome = (session) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {

        const res = await axios.post(`/event/deleteSessionOutcome/${session}`, config);

        dispatch({
            type: OUTCOME_DELETED,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: OUTCOME_DELETE_FAILED,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const isGenerated = (id) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {

        const res = await axios.post(`/event/isOutcomeGenerated`, config);

        dispatch({
            type: IS_GENERATED_CHECK,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: IS_GENERATED_CHECK_FAILED,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

export const deleteEvaluation = (student) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ student });
    try {

        const res = await axios.post(`/event/deleteEvaluation`, body, config);

        dispatch({
            type: EVALUATION_DELETED,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: EVALUATION_DELETE_FAILED,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}