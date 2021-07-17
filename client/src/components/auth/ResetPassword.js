import React, { Fragment } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, Redirect } from "react-router-dom";
import { resetPassword } from '../../appRedux/actions/auth';
import { setAlert } from '../../appRedux/actions/alert';

export const ResetPassword = ({ setAlert, resetPassword, isAuthenticated, loading }) => {

    const reset = (password, confirmpassword) => {
        if (password.length <= 5)
            return setAlert("Password should be more than 6 charachters", "danger")
        if (password === confirmpassword) {
            resetPassword(password);
            document.getElementById("link").click();
        } else {
            setAlert("Passwords do not match", "danger")
        }
    }

    if (isAuthenticated)
        return <Redirect to="dashboard" />

    return (
        <Fragment>
            <form className="input-primary">
                <text className="input-primary-txt">Reset Password</text>
                <div className="input-primary-div">
                    <input
                        className="input-primary-input"
                        type="password"
                        id="password"
                        name="password"
                        minLength="6"
                        required
                    />
                    <label className="input-primary-label" for="password">Password</label>
                    <div className="input-primary-bar"></div>
                </div>

                <div className="input-primary-div">
                    <input
                        className="input-primary-input"
                        type="password"
                        id="confirmpassword"
                        name="confirmpassword"
                        minLength="6"
                        required
                    />
                    <label className="input-primary-label" for="confirmpassword">Confirm Password</label>
                    <div className="input-primary-bar"></div>
                </div>

                <button type="submit"
                    id="1stbutton"
                    className="btn-primary"
                    value="Submit"
                    onClick={() => reset(document.getElementById("password").value, document.getElementById("confirmpassword").value)}>
                    <span>Set new Password</span>
                </button>
            </form>
            <Link id="link" to="/" />
        </Fragment>
    )
}

ResetPassword.propTypes = {
    isAuthenticated: PropTypes.object.isRequired,
    loading: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading
})

export default connect(mapStateToProps, { setAlert, resetPassword })(ResetPassword)
