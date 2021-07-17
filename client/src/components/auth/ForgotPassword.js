import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import { Redirect } from "react-router-dom";
import { sendPasswordResetToken, verifyResetToken, loadUser } from '../../appRedux/actions/auth';
import { connect } from 'react-redux'

const ForgotPassword = ({ sendPasswordResetToken, verifyResetToken, loadUser, isAuthenticated }) => {

    const send = async (email) => {
        await sendPasswordResetToken(email);
        document.getElementById("show").setAttribute("style", "display: content;");
        document.getElementById("1stbutton").setAttribute("style", "display: none;");
    }

    const verify = async (email, code) => {
        await verifyResetToken(email, code);
        loadUser();
    }

    if (isAuthenticated) {
        return <Redirect to="/ResetPassword" />;
    }

    return (
        <Fragment>
            <form className="input-primary">
                <text className="input-primary-txt">Please enter your email </text>
                <div className="input-primary-div">
                    <input
                        className="input-primary-input"
                        id="email"
                        type="text"
                        name="email"
                        required
                    />
                    <label className="input-primary-label" for="email">Email</label>
                    <div className="input-primary-bar"></div>
                </div>

                <div id="show" style={{ display: "none" }}>
                    <text className="login-form-header">Please enter your code </text>
                    <div className="input-primary-div">
                        <input
                            className="input-primary-input"
                            id="code"
                            type="text"
                            name="email"
                            required
                        />
                        <label className="input-primary-label" for="code">Code</label>
                        <div className="input-primary-bar"></div>
                    </div>
                    <button type="submit"
                        className="btn-primary"
                        value="Submit"
                        onClick={() => verify(document.getElementById("email").value, document.getElementById("code").value)}>
                        <span>Submit</span>
                    </button>
                </div>
                <button type="submit" className="btn-primary"
                    id="1stbutton"
                    value="Submit"
                    onClick={() => send(document.getElementById("email").value)}>
                    <span>Done</span>
                </button>
            </form>
        </Fragment>
    );
};

ForgotPassword.propTypes = {
    isAuthenticated: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { sendPasswordResetToken, verifyResetToken, loadUser })(ForgotPassword);
