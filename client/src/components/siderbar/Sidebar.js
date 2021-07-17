import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const Sidebar = ({ isAuthenticated, loading, auth }) => {

  return (
    <Fragment>
      {isAuthenticated && !loading ? (
        <Fragment>
          <ul className='sidebar-list'>
            {auth.user.role === 'student' ? (
              <Fragment>
                <div className="area"></div>
                <nav className="main-menu">
                  <ul>
                    <li>
                      <Link to='/'>
                        <i className="fa fa-home fa-2x"></i>
                        <span className="nav-text">
                          Dashboard
                        </span>
                      </Link>
                    </li>
                    <li className="has-subnav">
                      <Link to='/createGroup'>
                        <i className="fa fa-users fa-2x"></i>
                        <span className="nav-text">
                          My Group
                        </span>
                      </Link>
                    </li>
                    <li className="has-subnav">
                      <Link to="/editGroup">
                        <i className="fa fa-users fa-2x"></i>
                        <span className="nav-text">
                          Edit Group
                        </span>
                      </Link>
                    </li>
                    <li className="has-subnav">
                      <Link to="/requests">
                        <i className="fa fa-users fa-2x"></i>
                        <span className="nav-text">
                          Requests
                        </span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </Fragment>
            ) : null}

            {auth.user.role === 'external' ? (
              <Fragment >
                <div className="area"></div>
                <nav className="main-menu">
                  <ul>
                    <li>
                      <Link to='/'>
                        <i className="fa fa-home fa-2x"></i>
                        <span className="nav-text">
                          Dashboard
                        </span>
                      </Link>
                    </li>

                    <li className="has-subnav">
                      <Link to='/sessions'>
                        <i className="fa fa-calendar fa-2x"></i>
                        <span className="nav-text">
                          Sessions
                        </span>
                      </Link>
                    </li>

                  </ul>
                </nav>
              </Fragment>
            ) : null}



            {auth.user.role === 'instructor' ? (
              <Fragment >
                <div className="area"></div>
                <nav className="main-menu">
                  <ul>
                    <li>
                      <Link to='/'>
                        <i className="fa fa-home fa-2x"></i>
                        <span className="nav-text">
                          Dashboard
                        </span>
                      </Link>
                    </li>

                    <li className="has-subnav">
                      <Link to='/groups'>
                        <i className="fa fa-users fa-2x"></i>
                        <span className="nav-text">
                          My Groups
                        </span>
                      </Link>
                    </li>

                    <li className="has-subnav">
                      <Link to='/unapprovedgroups'>
                        <i className="fa fa-tag fa-2x"></i>
                        <span className="nav-text">
                          Group Requests
                        </span>
                      </Link>
                    </li>


                    <li className="has-subnav">
                      <Link to='/sessions'>
                        <i className="fa fa-calendar fa-2x"></i>
                        <span className="nav-text">
                          Sessions
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link to='/TopicHandler'>
                        <i className="fa fa-file fa-2x"></i>
                        <span className="nav-text">
                          Add Topic
                        </span>
                      </Link>
                    </li>

                  </ul>
                </nav>
              </Fragment>
            ) : null}

            {auth.user.role === 'coordinator' ? (
              <Fragment >
                <div className="area"></div>
                <nav className="main-menu">
                  <ul>
                    <li>
                      <Link to='/'>
                        <i className="fa fa-home fa-2x"></i>
                        <span className="nav-text">
                          Dashboard
                        </span>
                      </Link>
                    </li>

                    <li className="has-subnav">
                      <Link to='/sessions'>
                        <i className="fa fa-calendar fa-2x"></i>
                        <span className="nav-text">
                          Sessions
                        </span>
                      </Link>
                    </li>


                    <li>
                      <Link to='/outcome'>
                        <i className="fa fa-folder-open-o fa-2x"></i>
                        <span className="nav-text">
                          Outcomes
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link to='/TopicApprove'>
                        <i className="fa fa-check fa-2x"></i>
                        <span className="nav-text">
                          Topic Approve
                        </span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </Fragment>
            ) : null}

            {auth.user.role === 'coordinator' ? (
              <Fragment >
                <div className="area"></div>
                <nav className="main-menu">
                  <ul>
                    <li>
                      <Link to='/'>
                        <i className="fa fa-home fa-2x"></i>
                        <span className="nav-text">
                          Dashboard
                        </span>
                      </Link>
                    </li>

                    <li className="has-subnav">
                      <Link to='/groups'>
                        <i className="fa fa-users fa-2x"></i>
                        <span className="nav-text">
                          My Groups
                        </span>
                      </Link>
                    </li>

                    <li className="has-subnav">
                      <Link to='/unapprovedgroups'>
                        <i className="fa fa-tag fa-2x"></i>
                        <span className="nav-text">
                          Group Requests
                        </span>
                      </Link>
                    </li>

                    <li className="has-subnav">
                      <Link to='/addevent'>
                        <i className="fa fa-plus fa-2x"></i>
                        <span className="nav-text">
                          Add Session
                        </span>
                      </Link>

                    </li>
                    <li className="has-subnav">
                      <Link to='/sessions'>
                        <i className="fa fa-calendar fa-2x"></i>
                        <span className="nav-text">
                          Sessions
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link to='/rolesNew'>
                        <i className="fa fa-user fa-2x"></i>
                        <span className="nav-text">
                          Role Management
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link to="/rolesUsers">
                        <i className="fa fa-user fa-2x"></i>
                        <span className="nav-text">
                          Users
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link to='/outcome'>
                        <i className="fa fa-folder-open-o fa-2x"></i>
                        <span className="nav-text">
                          Outcomes
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link to='/TopicHandler'>
                        <i className="fa fa-file fa-2x"></i>
                        <span className="nav-text">
                          Add Topic
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link to='/TopicApprove'>
                        <i className="fa fa-check fa-2x"></i>
                        <span className="nav-text">
                          Topic Approve
                        </span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </Fragment>
            ) : null}

            {auth.user.role === 'chair' ? (
              <Fragment >
                <div className="area"></div>
                <nav className="main-menu">
                  <ul>
                    <li>
                      <Link to='/'>
                        <i className="fa fa-home fa-2x"></i>
                        <span className="nav-text">
                          Dashboard
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link to='/outcome'>
                        <i className="fa fa-folder-open-o fa-2x"></i>
                        <span className="nav-text">
                          Outcomes
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link to='/TopicApprove'>
                        <i className="fa fa-check fa-2x"></i>
                        <span className="nav-text">
                          Topic Approve
                        </span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </Fragment>
            ) : null}
          </ul>
        </Fragment>
      ) : null}
    </Fragment>
  )
}

Sidebar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  auth: state.auth
})

export default connect(mapStateProps)(Sidebar)
