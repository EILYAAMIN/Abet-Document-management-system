import React, { Fragment } from "react";
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from '../../images/icon.png';
import { logout } from '../../appRedux/actions/auth';


const Navbar = ({ isAuthenticated, logout, loading, user }) => {


    const LOGOUT = () => {
        logout();
        <Redirect to="/" />
    }

    if (!isAuthenticated)
        <Redirect to="/" />

    return (
        <Fragment>
            {loading ?
                null
                :
                <Fragment>
                    {isAuthenticated ?
                        <div className="navbar">
                            <Link to="/" className="link navbar-link-mainpage">Graduation Projects</Link>
                            <img src={logo} alt="logo" className="image-logo" />
                            <ul className="navbar-right flex">
                                <text className="navbar-left">
                                    {user.name} {user.surname}
                                </text>
                                <Link className="btn-primary logout" to='/' onClick={() => LOGOUT()}>
                                    <span>
                                        Logout
                                    </span>
                                </Link>
                            </ul>
                        </div>
                        :
                        <div className="navbar">
                            <Link to="/" className="link navbar-link-mainpage">Graduation Projects</Link>
                            <img src={logo} alt="logo" className="image-logo" />
                            <ul className="navbar-right">
                                <Link to="/login" className="btn-primary btn-primary-flex">
                                    <span>Login</span>
                                </Link>
                                <Link to="/signup" className="btn-primary btn-primary-flex">
                                    <span>SignUp</span>
                                </Link>
                            </ul>
                        </div>
                    }
                </Fragment>
            }
        </Fragment>
    )
}

Navbar.propTypes = {
    isAuthenticated: PropTypes.bool,
    loading: PropTypes.bool,
    logout: PropTypes.func,
    user: PropTypes.object.isRequired,
};

const mapStateProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading,
    user: state.auth.user
});

export default connect(mapStateProps, { logout })(Navbar);
