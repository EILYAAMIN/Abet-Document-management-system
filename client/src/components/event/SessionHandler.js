import React, { Fragment, useState } from "react";
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { setSession } from "../../appRedux/actions/event";
import { searchUsers, searchGroups } from "../../appRedux/actions/general";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const EventHandler = ({ setSession, searchUsers, searchGroups, users, stdgroups }) => {
    const [formData, setFormData] = useState({
        chair: {},
        external: {},
        members: [],
        groups: [],
        message: "",
        location: "",
        searchMember: "",
        searchchair: "",
        searchExternal: "",
        searchGroup: ""
    });

    const [date, setStartDate] = useState(new Date());

    const { chair, external, members, groups, message, location,
        searchMember, searchchair, searchExternal, searchGroup } = formData;

    const addMember = e => {
        if (!members.includes(e.target.value)) {
            members.push(e.target.value);
            setFormData({ ...formData, members });
        }
    }

    const createSession = () => {
        setSession(chair.id, external.id, members, groups, message, date, location);
    }

    const removeMember = e => {
        const removeIndex = members.map(member => member.toString())
            .indexOf(e);
        members.splice(removeIndex, 1);
        setFormData({ ...formData, members });
    }

    const removeGroup = e => {
        const RemoveIndex = stdgroups.map(group => group.toString())
            .indexOf(e);
        stdgroups.splice(RemoveIndex, 1);
        const removeIndex = groups.map(group => group.toString())
            .indexOf(e);
        groups.splice(removeIndex, 1);
        setFormData({ ...formData, groups });
    }

    const addGroup = e => {
        e.preventDefault();
        if (!groups.includes(e.target.value)) {
            groups.push(e.target.value);
            setFormData({ ...formData, groups });
        }
    }

    const addChair = (id, name, surname, idNum) => {
        setFormData({ ...formData, chair: { id, name, surname, idNum } });
    }

    const addExternal = (id, name, surname, idNum) => {
        setFormData({ ...formData, external: { id, name, surname, idNum } });
    }

    const onSearch = e => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
        searchUsers(e.target.value);
    }

    const onSearchGp = e => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
        searchGroups(e.target.value);
    }

    return (
        <Fragment>
            <div className="setSession">
                <div className="setSession--1">
                    <label className="dropdown-label">Date & Time</label>
                    <DatePicker
                        selected={date}
                        className=""
                        name="date"
                        value={date}
                        onChange={date => setStartDate(date)}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </div>
                <div className="setSession--2">
                    <label className="dropdown-label">Add Member</label>
                    <div class="dropdown">
                        <div className="dropdown-div"></div>
                        <i className="dropdown-div-search fa fa-search"></i>
                        <input
                            id="memberinput"
                            type="search"
                            className="dropdown-div-input"
                            name="searchMember"
                            value={searchMember}
                            autoComplete="off"
                            onChange={(e) => {
                                onSearch(e);
                            }}
                        />
                        <div
                            name="searchMember"
                            value={members}
                            className="dropdown-select" >
                            {users.map(user => {
                                return <option
                                    className="dropdown-select-option"
                                    onClick={(e) => {
                                        addMember(e);
                                        document.getElementById("memberinput").value = "";
                                    }}
                                    key={user._id}
                                    value={user._id}>
                                    {user.name} {user.surname} {user.idNum}
                                </option>
                            })}
                        </div>
                    </div>
                </div>
                <div className="invite-list setSession--3">
                    <section>
                        <div>
                            <text className="dropdown-text">Members List</text>
                            <ul className="check-list">
                                {users.map(member => {
                                    if (members.includes(member._id))
                                        return (
                                            <li
                                                key={member._id}
                                                className="" >
                                                {member.idNum} {member.name} {member.surname}
                                                <button
                                                    className="btn-cancel btn-secondary"
                                                    name="members"
                                                    value={members}
                                                    onClick={() => removeMember(member._id)}>
                                                    <span>remove</span></button>
                                            </li>
                                        )
                                })}
                            </ul>
                        </div>
                    </section>
                </div>
                <div className="setSession--4">
                    <label className="dropdown-label">Add Chair</label>
                    <div class="dropdown">
                        <div className="dropdown-div"></div>
                        <i className="dropdown-div-search fa fa-search"></i>
                        <input
                            id="chairinput"
                            type="search"
                            className="dropdown-div-input"
                            name="searchchair"
                            value={searchchair}
                            autoComplete="off"
                            onChange={(e) => {
                                onSearch(e);
                            }}
                        />
                        <div
                            name="chair"
                            value={chair}
                            className="dropdown-select" >
                            {users.map(user => {
                                return <option
                                    className="dropdown-select-option"
                                    onClick={() => {
                                        addChair(user._id, user.name, user.surname, user.idNum);
                                        document.getElementById("chairinput").value = "";
                                    }}
                                    key={user._id}
                                    value={user._id}>
                                    {user.name} {user.surname} {user.idNum}
                                </option>
                            })}
                        </div>
                    </div>
                </div>
                <div className="invite-list setSession--5">
                    <section>
                        <div>
                            <text className="dropdown-text">Chair of Session</text>
                            <ul className="check-list">
                                {chair.name !== undefined ?
                                    <li>{chair.name} {chair.surname} {chair.idNum}</li>
                                    :
                                    null}
                            </ul>
                        </div>
                    </section>
                </div>
                <div className="setSession--6">
                    <label className="dropdown-label">Add External</label>
                    <div class="dropdown">
                        <div className="dropdown-div"></div>
                        <i className="dropdown-div-search fa fa-search"></i>
                        <input
                            id="externalinput"
                            type="search"
                            className="dropdown-div-input"
                            name="searchExternal"
                            value={searchExternal}
                            autoComplete="off"
                            onChange={(e) => {
                                onSearch(e);
                            }}
                        />
                        <div
                            name="external"
                            value={external}
                            className="dropdown-select" >
                            {users.map(user => {
                                return <option
                                    className="dropdown-select-option"
                                    onClick={() => {
                                        addExternal(user._id, user.name, user.surname, user.idNum);
                                        document.getElementById("externalinput").value = "";
                                    }}
                                    key={user._id}
                                    value={user._id}>
                                    {user.name} {user.surname} {user.idNum}
                                </option>
                            })}
                        </div>
                    </div>
                </div>
                <div className="invite-list setSession--7">
                    <section>
                        <div>
                            <text className="dropdown-text">External Member of Session</text>
                            <ul className="check-list">
                                {external.name !== undefined ?
                                    <li>{external.name} {external.surname} {external.idNum}</li>
                                    :
                                    null}
                            </ul>
                        </div>
                    </section>
                </div>
                <div className="setSession--8">
                    <label className="dropdown-label">Add Group</label>
                    <div class="dropdown">
                        <div className="dropdown-div"></div>
                        <i className="dropdown-div-search fa fa-search"></i>
                        <input
                            id="groupinput"
                            type="search"
                            className="dropdown-div-input"
                            name="searchGroup"
                            value={searchGroup}
                            autoComplete="off"
                            onChange={(e) => {
                                onSearchGp(e);
                            }}
                        />
                        <div
                            name="searchMember"
                            value={groups}
                            className="dropdown-select" >
                            {stdgroups.map(group => {
                                return <option
                                    className="dropdown-select-option"
                                    onClick={(e) => {
                                        addGroup(e);
                                        document.getElementById("groupinput").value = "";
                                    }}
                                    key={group._id}
                                    value={group._id}>
                                    Group {group.number} 
                                </option>
                            })}
                        </div>
                    </div>
                </div>
                <div className="invite-list setSession--9">
                    <section>
                        <div>
                            <text className="dropdown-text">Groups List</text>
                            <ul className="check-list">
                                {stdgroups.map(group => {
                                    if (groups.includes(group._id))
                                        return (
                                            <li
                                                key={group._id}
                                                className="" >
                                                Group {group.number} - Leader: {group.leader.name} {group.leader.surname} - Advisor: {group.advisor.name} {group.advisor.surname}
                                                <button
                                                    className="btn-cancel btn-secondary"
                                                    name="groups"
                                                    value={groups}
                                                    onClick={() => removeGroup(group._id)}>
                                                    <span>Remove</span></button>
                                            </li>
                                        )
                                })}
                            </ul>
                        </div>
                    </section>
                </div>
                <div className="setSession--10">
                    <label className="dropdown-label">Location</label>
                    <input type="text"
                        className=""
                        name="location"
                        value={location}
                        autoComplete="off"
                        onChange={(e) => onSearch(e)} />
                </div>
                <div className="setSession--11">
                    <label className="dropdown-label">Message</label>
                    <input type="text"
                        className="message"
                        name="message"
                        value={message}
                        autoComplete="off"
                        onChange={(e) => onSearch(e)} />
                </div>
                <button className="sessionbutton btn-primary setSession--12" onClick={() => createSession()}>Create</button>
            </div>
        </Fragment>
    )
}

EventHandler.propTypes = {
    createSession: PropTypes.func.isRequired,
    searchUsers: PropTypes.func.isRequired,
    searchGroups: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    users: state.general.search,
    stdgroups: state.general.searchgroups
});

export default connect(mapStateToProps, { setSession, searchUsers, searchGroups })(EventHandler);
