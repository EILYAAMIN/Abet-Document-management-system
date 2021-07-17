import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import event from './event';
import general from './general';
import group from './group';
import report from './report';
import submission from './submission';
import supr from './supr';
import topic from './topic';

export default combineReducers({
    alert,
    auth,
    event,
    general,
    group,
    report,
    submission,
    supr,
    topic,
});