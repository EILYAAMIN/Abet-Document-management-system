import React, { Fragment } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


const MainPage = ({ user, loading, isAuthenticated }) => {

    return (!loading && isAuthenticated ?
        <Fragment>
            {user.isverified ?
                (user.role === null ? 
                <div className="dashboard">
                    <text className="dashboard-text">Your Account is awaiting approval<br/> See you soon.</text>
                </div>
                    :
                <div className="dashboard">
                    <text className="dashboard-text">Hi, Welcome to the ABET Document Management System</text>
                </div>)
                :
                <Redirect to='/confirmEmail' />
            }
        </Fragment>
        :
        null
    )
}


MainPage.propTypes = {
    user: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
    user: state.auth.user,
    loading: state.auth.loading,
    isAuthenticated: state.auth.isAuthenticated,
});


export default connect(mapStateToProps)(MainPage);