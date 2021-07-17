import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { Redirect, Link } from 'react-router-dom'
import {
  getStudent, getStudentGroup, getRubrics, getCriteria,
  getEvaluated, downloadEvaluation, generateOutcome, downloadSessionOutcome, isGenerated, deleteSessionOutcome, deleteEvaluation
} from '../../appRedux/actions/event'

const Sessions = ({ session, getEvaluated, downloadEvaluation, getStudent, isGenerated, generated, deleteEvaluation, getStudentGroup,
  generateOutcome, downloadSessionOutcome, deleteSessionOutcome, getRubrics, getCriteria, loading, evaluated, auth: { user: { _id }
  } }) => {

  useEffect(() => {
    getEvaluated();
    isGenerated();
  }, [getEvaluated, isGenerated])

  const onEvaluate = (id, course, topic) => {
    getRubrics(course, topic)
    getCriteria(course, topic)
    getStudentGroup(id)
    getStudent(id)
  }

  const downloadEvaluationFile = (id, student, studentnumber) => {
    downloadEvaluation(id, student, studentnumber)
  }

  const GenerateSessionOutcome = async session => {
    await generateOutcome(session)
    isGenerated()
  }

  const downloadOutcome = (session, chair, date) => {
    downloadSessionOutcome(session, chair, date)
  }

  const deleteOutcome = async session => {
    if (window.confirm("Click OK to remove the Session Outcome!")) {
      await deleteSessionOutcome(session)
      isGenerated()
    }
  }

  const DeleteEvaluation = async studentId => {
    if (window.confirm("Click OK to remove the Evaluation!")) {
      await deleteEvaluation(studentId)
      getEvaluated()
    }
  }

  return !session ? (
    loading ? (
      <Redirect to='/sessions' />
    ) : (
      <Spinner />
    )
  ) : (
    <Fragment>
      <section className="container">
        {session.chair._id === _id || session.coordinator._id === _id ? (
          <div>
            {!generated.includes(session._id) ? (
              <button className="btn-generate" onClick={() => GenerateSessionOutcome(session._id)}>
                <span>Generate Session Outcome</span>
              </button>
            ) : (
              <div>
                <button
                  className="btn-generate"
                  onClick={() =>
                    downloadOutcome(
                      session._id,
                      session.chair.name + session.chair.surname,
                      session.date
                    )
                  }
                ><span ></span>
                  Download Outcome
                </button>
                <button className="btn-generate btn-generate-red" onClick={() => deleteOutcome(session._id)}><span>
                  Delete Outcome
                </span>
                </button>
              </div>
            )}
          </div>
        ) : null}
        <div className="table">
          <div className="table-header">
            <div className="header__item"><text id="total" className="filter__link filter__link--number"># group</text></div>
            <div className="header__item"><text id="total" className="filter__link filter__link--number">name</text></div>
            <div className="header__item"><text id="total" className="filter__link filter__link--number">surname</text></div>
            <div className="header__item"><text id="total" className="filter__link filter__link--number"># student</text></div>
            <div className="header__item"><text id="name" className="filter__link">Supervisor</text></div>
            <div className="header__item"><text id="wins" className="filter__link filter__link--number">Leader</text></div>
            <div className="header__item"><text id="total" className="filter__link filter__link--number">OPTION</text></div>
          </div>
          <div className="table-content">
            {session.groups.map(group => {
              return (
                <div className="table-row">
                  <div className="table-data">{group.number}</div>
                  <div className="table-data">{group.leader.name}</div>
                  <div className="table-data">{group.leader.surname}</div>
                  <div className="table-data">{group.leader.idNum}</div>
                  <div className="table-data">{group.advisor.name + " " + group.advisor.surname}</div>
                  <div className="table-data">{group.leader.name + " " + group.leader.surname}</div>
                  <div className="table-data">
                    {evaluated.includes(group.leader._id) ? (
                      <div>
                        <button
                          className="btn-primary btn-approve"
                          onClick={() =>
                            downloadEvaluationFile(
                              group.leader._id,
                              group.leader.name + group.leader.surname,
                              group.leader.idNum
                            )
                          }
                        >
                          Download
                        </button>
                        <button className="btn-primary btn-cancel" onClick={() => DeleteEvaluation(group.leader._id)}>
                          Delete Evaluation
                        </button>
                      </div>
                    ) : (
                      <Link
                        className="btn-primary link"
                        onClick={() =>
                          onEvaluate(group.leader._id, group.leader.course, group.topic._id)
                        }
                        to={`/session/${session._id}/${group.leader._id}`}
                      >
                        Evaluate
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
            {session.groups.map(group => {
              return group.members.map(student => {
                return (
                  <div className="table-row">
                    <div className="table-data">{group.number}</div>
                    <div className="table-data">{student.name}</div>
                    <div className="table-data">{student.surname}</div>
                    <div className="table-data">{student.idNum}</div>
                    <div className="table-data">{group.advisor.name + " " + group.advisor.surname}</div>
                    <div className="table-data">{group.leader.name + " " + group.leader.surname}</div>
                    <div className="table-data">{evaluated.includes(student._id) ? (
                      <div>
                        <button
                          className="btn-primary btn-approve"
                          onClick={() =>
                            downloadEvaluationFile(
                              student._id,
                              student.name + student.surname,
                              student.idNum
                            )
                          }
                        >
                          Download
                        </button>
                        <button className="btn-primary btn-cancel" onClick={() => DeleteEvaluation(student._id)}>
                          Delete Evaluation
                        </button>
                      </div>
                    ) : (
                      <Link className="btn-primary link"
                        onClick={() =>
                          onEvaluate(student._id, student.course, group.topic._id)
                        }
                        to={`/session/${session._id}/${student._id}`}
                      >
                        Evaluate
                      </Link>
                    )}</div>
                  </div>
                )
              })
            })
            }
          </div>
        </div>
      </section>
    </Fragment >
  )
}

Sessions.propTypes = {
  auth: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  student: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  evaluated: PropTypes.array.isRequired,
  generated: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  session: state.event.session,
  student: state.event.student,
  group: state.event.group,
  loading: state.event.loading,
  evaluated: state.event.evaluated,
  generated: state.event.generated
})

export default connect(mapStateToProps, {
  getStudent,
  getStudentGroup,
  getRubrics,
  getCriteria,
  getEvaluated,
  downloadSessionOutcome,
  deleteSessionOutcome,
  downloadEvaluation,
  generateOutcome,
  isGenerated,
  deleteEvaluation
})(Sessions)
