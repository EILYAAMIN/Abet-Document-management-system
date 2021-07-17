import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getSessions, getSession, deleteSession } from '../../appRedux/actions/event'
import Spinner from '../layout/Spinner'

const Sessions = ({ getSessions, getSession, deleteSession, sessions, loading, user }) => {
  useEffect(() => {
    getSessions()
  }, [getSessions])

  const showSession = id => {
    getSession(id)
  }

  const sessionDelete = id => {
    if (window.confirm("Click OK to remove the Session!")) {
      deleteSession(id);
      getSessions();
    }
  }

  return (loading ? <Spinner /> :
    <div>
      {sessions.length === 0 ? (
        <div className="dashboard">
          <text className="dashboard-text">No session is set</text>
        </div>
      ) : (
        <Fragment>
          <Fragment>
            <div>
              <div className="container">
                <div className="table">
                  <div className="table-header">
                    <div className="header__item"><text id="name" className="filter__link">Open</text></div>
                    <div className="header__item"><text id="name" className="filter__link">Chair</text></div>
                    <div className="header__item"><text id="wins" className="filter__link filter__link--number">Date</text></div>
                    <div className="header__item"><text id="draws" className="filter__link filter__link--number">time</text></div>
                    <div className="header__item"><text id="losses" className="filter__link filter__link--number">location</text></div>
                    <div className="header__item"><text id="total" className="filter__link filter__link--number"># groups</text></div>
                    <div className="header__item"><text id="total" className="filter__link filter__link--number">OPTION</text></div>
                  </div>
                  {sessions.length > 0 ? sessions.map(sn => {
                    return (
                      <div className="table-content">
                        <div className="table-row hover" >
                          <div className="table-data"><Link className="btn-primary btn-open" id={sn._id}
                            to={`/session/${sn._id}`}
                            onClick={() => showSession(sn._id)}>Open</Link></div>
                          <div className="table-data">{sn.chair.name} {sn.chair.surname}</div>
                          <div className="table-data">{sn.date.substr(0, 10)}</div>
                          <div className="table-data">{sn.date.substr(11, 5)}</div>
                          <div className="table-data">{sn.location}</div>
                          <div className="table-data">{sn.groups.length}</div>
                          <div class="table-data">
                            {user.role === "coordinator" ?
                              <button className="btn-cancel btn-primary" onClick={() => sessionDelete(sn._id)}>
                                <span>
                                  Remove
                                </span>
                              </button> :
                              null
                            }
                          </div>
                        </div>
                      </div>
                    )
                  })
                    : null
                  }
                </div>
              </div>
            </div>
          </Fragment>
        </Fragment>
      )}
    </div>
  )
}

Sessions.propTypes = {
  getSessions: PropTypes.func.isRequired,
  getSession: PropTypes.func.isRequired,
  sessions: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  sessions: state.event.sessions,
  loading: state.auth.loading,
  user: state.auth.user
})

export default connect(mapStateToProps, { getSessions, getSession, deleteSession })(Sessions)
