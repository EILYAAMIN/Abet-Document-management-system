import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { createTopic, deleteTopic, getMyTopic } from '../../appRedux/actions/topic'

export const TopicHandler = ({ createTopic, deleteTopic, getMyTopic, topics, loading }) => {

    useEffect(() => {
        getMyTopic();
    }, [getMyTopic]);

    const create = async (name, type) => {
        await createTopic(name, type);
        getMyTopic();
    }

    const deletetopic = (id) => {
        deleteTopic(id);
    }

    return (
        <div className="topic">
            <div className="topic-set">
                <select
                    className="topic-select"
                    type="text"
                    id="type">
                    <option className="topic-select-option" value="SW">Type: Software</option>
                    <option className="topic-select-option" value="HW">Type: Hardware</option>
                </select>
                <input type="text"
                    id="name"
                    className="topic-input"
                    placeholder="Topic Name"
                    autoComplete="off" />
                <button className="btn-primary" onClick={() => create(document.getElementById('name').value, document.getElementById('type').value)}>Create</button>
            </div>
            <section className="topic-section">
                <label className="topic-section-label">My Topics</label>
                {!loading && topics.length > 0 ?
                    <div>
                        {topics.map(topic => {
                            return (
                                <tr className="topic-topics">
                                    <text className="topic-topics-data">{topic.name}</text>
                                    <text className="topic-topics-data">{topic.type}</text>
                                    {topic.approved === true ?
                                        <text>Approved</text>
                                        :
                                        <button className="btn-primary btn-cancel" onClick={() => deletetopic(topic._id)}>Delete</button>
                                    }
                                </tr>
                            )
                        })}
                    </div>
                    :
                    null}
            </section>
        </div>
    )
}

TopicHandler.propTypes = {
    topics: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
    topics: state.topic.topics,
    loading: state.topic.loading
})


export default connect(mapStateToProps, { createTopic, deleteTopic, getMyTopic })(TopicHandler)
