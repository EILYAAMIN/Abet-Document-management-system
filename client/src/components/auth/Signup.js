import React, { useState, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { setAlert } from '../../appRedux/actions/alert'
import { register } from '../../appRedux/actions/auth'
import PropTypes from 'prop-types'

const Signup = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    surname: '',
    idNum: '',
    course: '',
    password: '',
    password2: ''
  })

  const { name, email, surname, idNum, course, password, password2 } = formData

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger')
    } else {
      register({
        name,
        email,
        surname,
        idNum,
        course,
        password
      })
    }
  }

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />
  }



  return (
    <Fragment>
      <form className="input-primary" autocomplete="off" onSubmit={e => onSubmit(e)}>
        <text className="input-primary-txt" >Sign up</text>

        <label class="select" for="slct">
          <select id="slct" name='course' value={course} onChange={e => onChange(e)} required>
            <option value="" disabled="disabled" selected="selected">Select Course</option>
            <option value='CMSE406'>CMSE406</option>
            <option value='CMSE405'>CMSE405</option>
            <option value='CMPE406'>CMPE406</option>
            <option value='CMPE405'>CMPE405</option>
            <option value='BLGM406'>BLGM406</option>
            <option value='BLGM405'>BLGM405</option>
          </select>
        </label>

        <div className="input-primary-div">
          <input
            className="input-primary-input"
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
          <label className="input-primary-label" for="name">Name</label>
          <div className="input-primary-bar"></div>
        </div>

        <div className="input-primary-div">
          <input
            className="input-primary-input"
            id="surname"
            type="text"
            name="surname"
            value={surname}
            onChange={(e) => onChange(e)}
            required
          />
          <label className="input-primary-label" for="surname">Surname</label>
          <div className="input-primary-bar"></div>
        </div>

        <div className="input-primary-div">
          <input
            className="input-primary-input"
            id="idNum"
            type="text"
            name="idNum"
            value={idNum}
            onChange={(e) => onChange(e)}
            required
          />
          <label className="input-primary-label" for="idNum">ID Number</label>
          <div className="input-primary-bar"></div>
        </div>

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

        <div className="input-primary-div">
          <input
            className="input-primary-input"
            type="password"
            id="password2"
            name="password2"
            minLength="6"
            value={password2}
            onChange={(e) => onChange(e)}
            required
          />
          <label className="input-primary-label" for="password2">Confirm Password</label>
          <div className="input-primary-bar"></div>
        </div>

        <button type="submit" className="btn-primary">
          <span>Register</span>
        </button>

        <Link className="link input-primary-link" to="/Login">
          <text>Already have an account? </text>
          Sign In
        </Link>

      </form>
    </Fragment>
  )
}

Signup.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateProps, { setAlert, register })(Signup)
