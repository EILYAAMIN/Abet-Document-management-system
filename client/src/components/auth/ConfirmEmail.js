import React, { Fragment, useState } from "react";
import { Link, Redirect } from 'react-router-dom'
import PropTypes from "prop-types";
import { verifyEmail, resendVerificationCode } from '../../appRedux/actions/auth';
import { connect } from 'react-redux'

const ConfirmEmail = ({ verifyEmail, resendVerificationCode, auth, loading, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    code: "",
  });

  const { code } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async () => {
    verifyEmail(code);
  };

  const resend = () => {
    resendVerificationCode();
  };

  return (!loading && isAuthenticated ?
    <Fragment>
      {!auth.user.isverified ? <form className="input-primary" onSubmit={(e) => onSubmit(e)}>
        <text className="input-primary-txt">verification code is <br/>sent to your email.</text>
        <div className="input-primary-div">
          <input
            className="input-primary-input"
            id="code"
            type="code"
            name="code"
            value={code}
            onChange={(e) => onChange(e)}
            required
          />
          <label className="input-primary-label" for="code">Verification Code</label>
          <div className="input-primary-bar"></div>
        </div>

        <button type="submit" className="btn-primary" onClick={() => onSubmit()}>
          <span>Submit</span>
        </button>

        <text>Didn't recieve the code? </text>
        <Link className="link input-primary-link" onClick={() => resend()}>
        Resend code
        </Link>
      </form>
        :
        <Redirect to='/' />
      }
    </Fragment>
    :
    null
  );
};

ConfirmEmail.propTypes = {
  auth: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  auth: state.auth,
  loading: state.auth.loading,
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { verifyEmail, resendVerificationCode })(ConfirmEmail);
