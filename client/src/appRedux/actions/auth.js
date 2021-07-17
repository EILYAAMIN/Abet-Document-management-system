import axios from 'axios';
import { setAlert } from './alert';
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, EMAIL_VERIFIED,
    EMAIL_VERIFICATION_FAILED, VERIFICATION_CODE_SENT, VERIFICATION_CODE_RESEND_FAILED, RESET_CODE_SENT,
    RESET_CODE_SEND_FAILED, TOKEN_VERIFIED,
    VERIFICATION_FAILED,
    PASSWORD_RESET,
    PASSWORD_RESET_FAILED
 } from './types';
import setAuthToken from '../../utils/setAuthToken';


// Load User
export const loadUser = () => async dispatch => {
    
    if (localStorage.token) {
        setAuthToken(localStorage.token)
    }

    try {
        const res = await axios.get('/auth/');
        
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
};

//Register User
export const register = ({ name, email, surname, idNum, course, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({
        name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
        email,
        surname: surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase(), 
        idNum,
        course,
        password
    });

    try {

        const res = await axios.post('/auth/register', body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: REGISTER_FAIL
        });
    }
}



//Login User
export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('/auth/login', body, config);
        
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: LOGIN_FAIL
        });
    }
}

//Logout / Clear Profile
export const logout = () => dispatch => {
    dispatch({ type: LOGOUT });
};


export const verifyEmail = (token) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    try {
        const res = await axios.post(`/auth/emailVerificatoin/${token}`, config);

        dispatch({
            type: EMAIL_VERIFIED,
            payload: res.data
        });
        dispatch(setAlert('Email Verified', 'seccess'));
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: EMAIL_VERIFICATION_FAILED
        });
    }
}


export const resendVerificationCode = () => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    try {
        const res = await axios.post(`/auth/resendVerificationCode`, config);

        dispatch({
            type: VERIFICATION_CODE_SENT,
            payload: res.data
        });
        dispatch(setAlert('Verification code is sent to your email', 'seccess'));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: VERIFICATION_CODE_RESEND_FAILED
        });
    }
}

export const sendPasswordResetToken = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    const body = JSON.stringify({email});
    
    try {
        const res = await axios.post(`/auth/sendPasswordResetToken`, body, config);
        
        dispatch({
            type: RESET_CODE_SENT,
            payload: res.data
        });
        dispatch(setAlert('Reset code is sent to your email', 'seccess'));
    } catch (err) {
        const errors = err.response.data.errors;
        
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        
        dispatch({
            type: RESET_CODE_SEND_FAILED
        });
    }
}


export const verifyResetToken = (email, code) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    const body = JSON.stringify({email, code});

    try {
        const res = await axios.post(`/auth/verifyResetToken`, body, config);

        dispatch({
            type: TOKEN_VERIFIED,
            payload: res.data
        });
        
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: VERIFICATION_FAILED
        });
    }
}


export const resetPassword = (password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({password});
    
    try {
        const res = await axios.post(`/auth/resetPassword`, body, config);

        dispatch({
            type: PASSWORD_RESET,
            payload: res.data
        });
        dispatch(setAlert('Password has been updated', 'seccess'));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: PASSWORD_RESET_FAILED
        });
    }
}


