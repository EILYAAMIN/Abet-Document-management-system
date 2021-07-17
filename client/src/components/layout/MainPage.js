import React, { Fragment } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import view from '../../images/view.jpeg';


const MainPage = ({ isAuthenticated }) => {

    if (isAuthenticated) {
        return <Redirect to='/dashboard' />;
    }
    return (
        <Fragment className="mainpage">
            <div className="mainpaage-view">
                <div className="mainpage-view-text">
                    <text>EMU</text>
                    <text>Department of Computer Engineering</text>
                </div>
                <img src={view} alt="img" className="mainpage-view-img" />
            </div>
        </Fragment>
    )
}


MainPage.propTypes = {
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps)(MainPage);