import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { evaluate } from '../../appRedux/actions/event'
import { Redirect } from 'react-router-dom'

function Evaluate({ evaluate, rubrics, critaria, session, student, group, loading, Loading }) {

  const [formData, setFormData] = useState({
    originality: '1',
    ReportTableGrades: new Array(17).fill(1),
    CoopGrades: new Array(3).fill(1),
    QualityGrades: new Array(5).fill(1),
    PresentGrades: new Array(5).fill(1)
  })

  const { ReportTableGrades, CoopGrades, QualityGrades, PresentGrades, originality } = formData;

  const addGrade = (e, index) => {
    if (e.target.value > 4 || e.target.value < 1) {
      window.confirm("Please enter a value in range 1 to 4!");
      document.getElementById(`${e.target.name + index}`).value = "";
    }
    else {
      switch (e.target.name) {
        case 'ReportTableGrades':
          ReportTableGrades.splice(index, 1, e.target.value)
          break
        case 'CoopGrades':
          CoopGrades.splice(index, 1, e.target.value)
          break
        case 'QualityGrades':
          QualityGrades.splice(index, 1, e.target.value)
          break
        case 'PresentGrades':
          PresentGrades.splice(index, 1, e.target.value)
          break
        default:
          break
      }
    }
  }

  const addOriginality = e => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onEvaluate = () => {
    setFormData({ ...formData, code: `${student.course}${group.topic.type}` })
    evaluate(
      `${student.course}${group.topic.type}`,
      ReportTableGrades,
      CoopGrades,
      QualityGrades,
      PresentGrades,
      originality,
      session._id,
      group._id,
      student._id
    )
  }

  return (!loading && (!rubrics || !student || !critaria || !session || !group) ?
    <Spinner />
    :
    <Fragment>
      {rubrics.length === 0 ?
        <Redirect to="/sessions" /> :
        <div className="evaluation-container" >
          <div id="container">
            <section className="evaluation-section">
              <table className="evaluation-table">
                <tr className="tr">
                  <th className="th">Student Name</th>
                  <th className="th">Student Surname</th>
                  <th className="th">Student Number</th>
                  <th className="th">Project Title</th>
                  <th className="th">Group Number</th>
                  <th className="th">Adviosr</th>
                </tr>
                <tr className="tr">
                  <td className="td">{student.name}</td>
                  <td className="td">{student.surname}</td>
                  <td className="td">{student.idNum}</td>
                  <td className="td">{group.topic.name}</td>
                  <td className="td">{group.number}</td>
                  <td className="td">{group.advisor.name + " " + group.advisor.surname}</td>
                </tr>
              </table>
            </section>
            <section className="evaluation-section">
              <table className="evaluation-table">
                <tr className="tr">
                  <th className="th"></th>
                  <th className="th">Report (40 %)</th>
                  <th className="th">Score</th>
                  <th className="th">Weight</th>
                </tr>
                {critaria.ReportTableLabels !== undefined ?
                  critaria.ReportTableLabels.map((label, index) => {
                    return (
                      <tr className="tr">
                        <tabel className="evaluation-table">
                          <button className='btn-help'
                            onClick={() => {
                              document.getElementById(`rubric-report-${index}`).classList.remove("hide");
                              document.getElementById(`container`).classList.add("blur-filter");
                            }}>
                            ?
                          </button>
                        </tabel>
                        <td className="td-label">{label}</td>
                        <input
                          id={"ReportTableGrades" + `${index}`}
                          placeholder="1-4"
                          type='input'
                          className='evaluation-input'
                          name='ReportTableGrades'
                          autoComplete='off'
                          onChange={e => addGrade(e, index)}
                        />
                        <td className="td">{critaria.ReportTableWeights[index]}</td>
                      </tr>
                    )
                  })
                  : null}
              </table>
            </section>
            <section className="evaluation-section">
              <table className="evaluation-table">
                <tr className="tr">
                  <th className="th"></th>
                  <th className="th">Cooperation with Supervisor (10 %)</th>
                  <th className="th">Score</th>
                  <th className="th">Weight</th>
                </tr>
                {critaria.CoopLabels !== undefined ?
                  critaria.CoopLabels.map((label, index) => {
                    return (
                      <tr className="tr">
                        <tabel className=''>
                          <button className='btn-help'
                            onClick={() => {
                              document.getElementById(`rubric-cooperation-${index}`).classList.remove("hide");
                              document.getElementById(`container`).classList.add("blur-filter");
                            }}>
                            ?
                          </button>
                        </tabel>
                        <td className="td-label">{label}</td>
                        <input
                        id={"CoopGrades" + `${index}`}
                          placeholder="1-4"
                          type='input'
                          className='evaluation-input'
                          name='CoopGrades'
                          autoComplete='off'
                          onChange={e => addGrade(e, index)}
                        />
                        <td className="td">{critaria.CoopWeights[index]}</td>
                      </tr>
                    )
                  })
                  : null}
              </table>
            </section>
            <section className="evaluation-section">
              <table className="evaluation-table">
                <tr className="tr">
                  <th className="th"></th>
                  <th className="th">Quality and contribution of the project (30 %)</th>
                  <th className="th">Score</th>
                  <th className="th">Weight</th>
                </tr>
                {critaria.QualityLabels !== undefined
                  ? critaria.QualityLabels.map((label, index) => {
                    return (
                      <tr className="tr">
                        <tabel className=''>
                          <button className='btn-help'
                            onClick={() => {
                              document.getElementById(`rubric-quality-${index}`).classList.remove("hide")
                              document.getElementById(`container`).classList.add("blur-filter");
                            }}>
                            ?
                          </button>
                        </tabel>
                        <td className="td-label">{label}</td>
                        <input
                        id={"QualityGrades" + `${index}`}
                          placeholder="1-4"
                          type='input'
                          className='evaluation-input'
                          name='QualityGrades'
                          autoComplete='off'
                          onChange={e => addGrade(e, index)}
                        />
                        <td className="td">{critaria.QualityWeights[index]}</td>
                      </tr>
                    )
                  })
                  : null}
              </table>
            </section>
            <section className="evaluation-section">
              <h1></h1>
              <table className="evaluation-table">
                <tr className="tr">
                  <th className="th"></th>
                  <th className="th">Presentation (20 %)</th>
                  <th className="th">Score</th>
                  <th className="th">Weight</th>
                </tr>
                {critaria.PresentLabels !== undefined
                  ? critaria.PresentLabels.map((label, index) => {
                    return (
                      <tr className="tr">
                        <tabel className=''>
                          <button className='btn-help'
                            onClick={() => {
                              document.getElementById(`rubric-present-${index}`).classList.remove("hide");
                              document.getElementById(`container`).classList.add("blur-filter");
                            }}>
                            ?
                          </button>
                        </tabel>
                        <td className="td-label">{label}</td>
                        <input
                        id={"PresentGrades" + `${index}`}
                          placeholder="1-4"
                          type='input'
                          className='evaluation-input'
                          name='PresentGrades'
                          autoComplete='off'
                          onChange={e => addGrade(e, index)}
                        />
                        <td className="td">{critaria.PresentWeights[index]}</td>
                      </tr>
                    )
                  })
                  : null}
              </table>
            </section>
            <section className="evaluation-section">
              <h1></h1>
              <table className="evaluation-table">
                <tr className="tr">
                  <th className="th">Originality</th>
                  <th className="th">Submit</th>
                </tr>
                <tr className="tr">
                  <td className="td-label">
                    <input
                      placeholder='ORIGINALITY 1-100'
                      min="0"
                      max="100"
                      step="10"
                      type='input'
                      className='originality-input'
                      name='originality'
                      autoComplete='off'
                      onChange={e => addOriginality(e)}
                    /></td>
                  <td className="center"><button className="btn-primary center" onClick={() => onEvaluate()}>evaluate</button></td>
                </tr>
              </table>
            </section>
          </div>

          <section className="evaluation-section">
            {rubrics.report !== undefined ? rubrics.report.map((rubric, index) => {
              return (
                <table className="rubric hide" id={`rubric-report-${index}`}>
                  <button className="btn-primary btn-cancel"
                    onClick={() => {
                      document.getElementById(`rubric-report-${index}`).classList.add("hide");
                      document.getElementById(`container`).classList.remove("blur-filter");
                    }}>Close</button>
                  <tr className="tr">
                    <th className="th"></th>
                    <th className="th">4</th>
                    <th className="th">3</th>
                    <th className="th">2</th>
                    <th className="th">1</th>
                  </tr>
                  <td className="th">{rubric.label}</td>
                  <td className="th">{rubric.grade4}</td>
                  <td className="th">{rubric.grade3}</td>
                  <td className="th">{rubric.grade2}</td>
                  <td className="th">{rubric.grade1}</td>
                </table>
              )
            }) : null}
          </section>

          <section className="evaluation-section">
            {rubrics.present !== undefined ? rubrics.present.map((rubric, index) => {
              return (
                <table className="rubric hide" id={`rubric-present-${index}`}>
                  <button className="btn-primary btn-cancel"
                    onClick={() => {
                      document.getElementById(`rubric-present-${index}`).classList.add("hide");
                      document.getElementById(`container`).classList.remove("blur-filter");
                    }
                    }>Close</button>
                  <tr className="tr">
                    <th className="th"></th>
                    <th className="th">4</th>
                    <th className="th">3</th>
                    <th className="th">2</th>
                    <th className="th">1</th>
                  </tr>
                  <td className="th">{rubric.label}</td>
                  <td className="th">{rubric.grade4}</td>
                  <td className="th">{rubric.grade3}</td>
                  <td className="th">{rubric.grade2}</td>
                  <td className="th">{rubric.grade1}</td>
                </table>
              )
            }) : null}
          </section>

          <section className="evaluation-section">
            {rubrics.quality !== undefined ? rubrics.quality.map((rubric, index) => {
              return (
                <table className="rubric hide" id={`rubric-quality-${index}`}>
                  <button className="btn-primary btn-cancel"
                    onClick={() => {
                      document.getElementById(`rubric-quality-${index}`).classList.add("hide");
                      document.getElementById(`container`).classList.remove("blur-filter");
                    }}>Close</button>
                  <tr className="tr">
                    <th className="th"></th>
                    <th className="th">4</th>
                    <th className="th">3</th>
                    <th className="th">2</th>
                    <th className="th">1</th>
                  </tr>
                  <td className="th">{rubric.label}</td>
                  <td className="th">{rubric.grade4}</td>
                  <td className="th">{rubric.grade3}</td>
                  <td className="th">{rubric.grade2}</td>
                  <td className="th">{rubric.grade1}</td>
                </table>
              )
            }) : null}
          </section>

          <section className="evaluation-section">
            {rubrics.cooperation !== undefined ? rubrics.cooperation.map((rubric, index) => {
              return (
                <table className="rubric hide" id={`rubric-cooperation-${index}`}>
                  <button className="btn-primary btn-cancel"
                    onClick={() => {
                      document.getElementById(`rubric-cooperation-${index}`).classList.add("hide");
                      document.getElementById(`container`).classList.remove("blur-filter");
                    }}>Close</button>
                  <tr className="tr">
                    <th className="th"></th>
                    <th className="th">4</th>
                    <th className="th">3</th>
                    <th className="th">2</th>
                    <th className="th">1</th>
                  </tr>
                  <td className="th">{rubric.label}</td>
                  <td className="th">{rubric.grade4}</td>
                  <td className="th">{rubric.grade3}</td>
                  <td className="th">{rubric.grade2}</td>
                  <td className="th">{rubric.grade1}</td>
                </table>
              )
            }) : null}
          </section>
        </div>
      }
    </Fragment>
  )
}

Evaluate.propTypes = {
  rubrics: PropTypes.object.isRequired,
  critaria: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  student: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  Loading: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
  rubrics: state.event.rubrics,
  critaria: state.event.criteria,
  session: state.event.session,
  student: state.event.student,
  group: state.event.group,
  loading: state.event.loading,
  Loading: state.event.Loading,
})

export default connect(mapStateToProps, { evaluate })(Evaluate)
