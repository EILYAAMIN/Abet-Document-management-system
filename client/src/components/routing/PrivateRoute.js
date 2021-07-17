import React, { Fragment } from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const PrivateRoute = ({
  role,
  role2,
  role3,
  role4,
  component: Component,
  isAuthenticated,
  auth,
  loading,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated && !loading ? (
        <Fragment>
          {role && role.length > 0 && ![role, role2, role3, role4].includes(auth.user.role) ? (
            <Redirect to='/dashboard' />
          ) : (
            <Component {...props} />
          )}
        </Fragment>
      ) : null
    }
  />
)

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  auth: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth,
  loading: state.auth.loading
})

export default connect(mapStateToProps)(PrivateRoute)
