import React, { useState, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../appRedux/actions/auth";

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
    <Redirect to="/" />;
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <form className="input-primary" onSubmit={(e) => onSubmit(e)}>
        <text className="input-primary-txt" >Sign in</text>
        <div className="input-primary-div">
          <input
            className="input-primary-input"
            id="email"
            type="text"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
          <label className="input-primary-label" for="email">Email</label>
          <div className="input-primary-bar"></div>
        </div>

        <div className="input-primary-div">
          <input
            className="input-primary-input"
            type="password"
            id="password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
          <label className="input-primary-label" for="password">Password</label>
          <div className="input-primary-bar"></div>
        </div>

        <button type="submit" className="btn-primary">
          <span>Login</span>
        </button>

        <Link className="link input-primary-link" to="/forgotPassword">
          Forgot Password?
        </Link>
        
        <text>Don't have an account? </text>
        <Link className="link input-primary-link" to="/signup">
          Create an account
        </Link>

      </form>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
