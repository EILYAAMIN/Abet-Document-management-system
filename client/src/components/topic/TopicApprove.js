import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { approveTopic, disApproveTopic, getapprovedTopics, getUnapprovedTopics } from '../../appRedux/actions/topic'

export const TopicApprove = ({ approveTopic, disApproveTopic, getapprovedTopics, getUnapprovedTopics, unapprovedtopics, topics, loading }) => {
    useEffect(() => {
        getapprovedTopics();
        getUnapprovedTopics();
    }, [getapprovedTopics, getUnapprovedTopics]);

    const approve = async (id) => {
        if (window.confirm("Click OK to Approve the Topic!")) {
            await approveTopic(id);
            getapprovedTopics();
            getUnapprovedTopics();
        }
    }

    const disapprove = async (id) => {
        if (window.confirm("Click OK to Disapprove the Topic. Please make sure that No groups has selected this topic before Disapproving!")) {
            await disApproveTopic(id);
            getapprovedTopics();
            getUnapprovedTopics();
        }
    }

    return (
        <div className="topic">
            {!loading ?
                <div>
                    <label className="topic-section-label">Topics</label>
                    <div className="topic-section">
                        {unapprovedtopics !== undefined ?
                            unapprovedtopics.map(topic => {
                                return (
                                    <tr className="topic-topics">
                                        <text className="topic-topics-data">{topic.name}</text>
                                        <text className="topic-topics-data">{topic.type}</text>
                                        <button className="topic-topics-data btn-primary btn-approve" onClick={() => approve(topic._id)}>Approve</button>
                                    </tr>
                                )
                            })
                            : null}
                    </div>
                    <div className="topic-section">
                        {topics !== undefined ?
                            topics.map(topic => {
                                return (
                                    <tr className="topic-topics">
                                        <text className="topic-topics-data">{topic.name}</text>
                                        <text className="topic-topics-data">{topic.type}</text>
                                        <button className="topic-topics-data btn-primary btn-cancel" onClick={() => disapprove(topic._id)}>DisApprove</button>
                                    </tr>
                                )
                            })
                            : null}
                    </div>
                </div>
                :
                null}
        </div>
    )
}

TopicApprove.propTypes = {
    unapprovedtopics: PropTypes.array.isRequired,
    topics: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
    unapprovedtopics: state.topic.unapprovedtopics,
    topics: state.topic.topics,
    loading: state.topic.loading,
})

export default connect(mapStateToProps, { approveTopic, disApproveTopic, getapprovedTopics, getUnapprovedTopics })(TopicApprove)
