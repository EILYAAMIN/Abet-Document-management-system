import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { generateExcel, downloadFiles } from '../../appRedux/actions/supr'

const Outcome = ({generateExcel, downloadFiles}) => {


    const generate = (courseName) => {
        generateExcel(courseName);
    } 
    
    return (
        <div className="outcome">
            <section className="outcome-section">
                <text className="outcome-text">CMSE406 Software</text>
                <button className="btn-primary" onClick={() => generate(`CMSE406SW`)}>Generate</button>
            </section>
            <section className="outcome-section">
                <text className="outcome-text">CMPE406 Hardware</text>
                <button className="btn-primary" onClick={() => generate(`CMPE406HW`)}>Generate</button>
            </section>
            <section className="outcome-section">
                <text className="outcome-text">CMPE406 Software</text>
                <button className="btn-primary" onClick={() => generate(`CMPE406SW`)}>Generate</button>
            </section>
            <section className="outcome-section">
                <text className="outcome-text">BLGM406 Software</text>
                <button className="btn-primary" onClick={() => generate(`BLGM406SW`)}>Generate</button>
            </section>
            <section className="outcome-section">
                <text className="outcome-text">BLGM406 Hardware</text>
                <button className="btn-primary" onClick={() => generate(`BLGM406HW`)}>Generate</button>
            </section>
            <section className="outcome-section">
                <text className="outcome-text">System Files</text>
                <button className="btn-primary" onClick={() => downloadFiles()}>Download</button>
            </section>
        </div>
    )
}

Outcome.propTypes = {
    prop: PropTypes
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps, {generateExcel, downloadFiles})(Outcome)
