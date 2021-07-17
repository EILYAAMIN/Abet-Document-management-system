import React, { Fragment, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTopicsPUB } from '../../../appRedux/actions/topic';
import { searchStudents } from '../../../appRedux/actions/general';
import { editGroup } from '../../../appRedux/actions/group';
import { getCreatedGroup } from '../../../appRedux/actions/group';
import { deleteGroup } from '../../../appRedux/actions/group';
import Spinner from '../../layout/Spinner';

const EditGroup = ({ getTopicsPUB, searchStudents, editGroup, isAuthenticated,
    getCreatedGroup, deleteGroup, topics, users, group: { groups, loading } }) => {
    useEffect(() => {
        getTopicsPUB();
        getCreatedGroup();
    }, [getTopicsPUB, getCreatedGroup]);

    const [formData, setFormData] = useState({
        search: "",
        topic: "",
        members: []
    });

    const { search, topic, members } = formData;

    const addMember = e => {
        e.preventDefault();
        if (!members.includes(e.target.value) && members.length <= 2) {
            members.push(e.target.value);
            setFormData({ ...formData, members });
        }
    }

    const removeMember = e => {
        const removeIndex = members.map(member => member.toString())
            .indexOf(e);
        members.splice(removeIndex, 1);
        setFormData({ ...formData, members });
    }

    const addTopic = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const createGp = async () => {
        await editGroup(topic, members);
        getCreatedGroup();
    }

    const onSearch = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        e.preventDefault();
        searchStudents(search);
    }

    const deleteMyGroup = async () => {
        await deleteGroup();
        getCreatedGroup();
    }


    return (loading ?
        <Spinner /> :
        (groups.length > 0 && isAuthenticated ?
            <Fragment>
                <div className="container">
                    <div className="creategp">
                        <div>
                            <select
                                className="input-primary"
                                type="text"
                                name="topic"
                                value={topic}
                                onChange={(e) => addTopic(e)}>
                                <option>Choose Your Topic</option>
                                {topics.map(topic => {
                                    return <option key={topic._id} value={topic._id}>{topic.name}</option>
                                })}
                            </select>
                        </div>
                        <div>
                            <label className="dropdown-label">Seach for groupmates</label>
                            <div class="dropdown">
                                <div className="dropdown-div"></div>
                                <i className="dropdown-div-search fa fa-search"></i>
                                <input
                                    id="search"
                                    type="search"
                                    className="dropdown-div-input"
                                    name="search"
                                    value={search}
                                    autoComplete="off"
                                    onChange={(e) => onSearch(e)}
                                />
                                <div
                                    type="text"
                                    name="members"
                                    value={members}
                                    className="dropdown-select">
                                    {users.map(user => {
                                        return <option
                                            onClick={(e) => addMember(e)}
                                            className="dropdown-select-option"
                                            key={user._id}
                                            value={user._id}>
                                            {user.name} {user.surname} {user.idNum}
                                        </option>
                                    })}
                                </div>
                            </div>
                        </div>
                        <section>
                            <div>
                                <text className="dropdown-text">Groups List</text>
                                <ul className="check-list">
                                    {users.map(member => {
                                        if (members.includes(member._id))
                                            return (
                                                <li
                                                    key={member._id}
                                                    className="" >
                                                    ID: {member.idNum} - Name & Surname: {member.name} {member.surname}
                                                    <button
                                                        className="btn-cancel btn-secondary"
                                                        name="groups"
                                                        value={members}
                                                        onClick={() => removeMember(member._id)}>
                                                        <span>Remove</span></button>
                                                </li>
                                            )
                                    })}
                                </ul>
                            </div>
                        </section>
                        <button className="btn-primary" onClick={() => createGp()}>Done</button>
                    </div>
                    <div>
                        <div className="container">
                            <div className="table">
                                <div className="table-header">
                                    <div className="header__item"><text id="name" className="filter__link">NUMBER</text></div>
                                    <div className="header__item"><text id="wins" className="filter__link filter__link--number">TOPIC</text></div>
                                    <div className="header__item"><text id="draws" className="filter__link filter__link--number">LEADER</text></div>
                                    <div className="header__item"><text id="losses" className="filter__link filter__link--number">MEMBERS</text></div>
                                    <div className="header__item"><text id="total" className="filter__link filter__link--number">STATUS</text></div>
                                    <div className="header__item"><text id="total" className="filter__link filter__link--number">OPTIONS</text></div>
                                </div>
                                {groups.length > 0 && !groups.includes(null) ? groups.map(group => {
                                    return (
                                        <div className="table-content">
                                            <div className="table-row">
                                                <div className="table-data">{group.number}</div>
                                                <div className="table-data">{group.topic.name}</div>
                                                <div className="table-data">{group.leader.name} {group.leader.surname}</div>
                                                <div >{group.members.length === 0 ? null :
                                                    group.members.map(member => {
                                                        return <div className="table-data">{member.name + " " + member.surname}<br /></div>
                                                    })}
                                                </div>
                                                <div className="table-data">{group.advisor.approved ? <i className="approve fa fa-check fa-2x"></i> : "Awaiting Approval"}</div>
                                                <div class="table-data">
                                                    <button className="btn-cancel btn-primary" onClick={() => deleteMyGroup()}>
                                                        <span>
                                                            Delete
                                                        </span>
                                                    </button>
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
                </div>
            </Fragment> :
            <Fragment>
                <h2>No group</h2>
            </Fragment>
        )
    )
}


EditGroup.propTypes = {
    getTopicsPUB: PropTypes.func.isRequired,
    topics: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    loading: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    topics: state.topic.topics,
    users: state.general.search,
    group: state.group,
    loading: state.auth.loading,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(
    mapStateToProps,
    { getTopicsPUB, searchStudents, editGroup, getCreatedGroup, deleteGroup }
)(EditGroup);
