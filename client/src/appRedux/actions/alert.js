import {v5 as uuid} from 'uuid'

import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, timeout = 2500) => dispatch => {
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id: uuid }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: uuid }), timeout);
};