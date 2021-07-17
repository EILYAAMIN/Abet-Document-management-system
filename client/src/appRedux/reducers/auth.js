import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  EMAIL_VERIFIED,
  EMAIL_VERIFICATION_FAILED,
  VERIFICATION_CODE_SENT,
  VERIFICATION_CODE_RESEND_FAILED,
  RESET_CODE_SENT,
  RESET_CODE_SEND_FAILED,
  TOKEN_VERIFIED,
  VERIFICATION_FAILED,
  PASSWORD_RESET,
  PASSWORD_RESET_FAILED
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function func(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case EMAIL_VERIFIED:
    case VERIFICATION_CODE_SENT:
    case EMAIL_VERIFICATION_FAILED:
    case VERIFICATION_CODE_RESEND_FAILED:
    case RESET_CODE_SENT:
    case RESET_CODE_SEND_FAILED:
    case PASSWORD_RESET_FAILED:
      return {
        ...state,
      };
    case USER_LOADED:
    case PASSWORD_RESET:
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false,
      };
    case TOKEN_VERIFIED:
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        user: payload.user,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case VERIFICATION_FAILED:
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
