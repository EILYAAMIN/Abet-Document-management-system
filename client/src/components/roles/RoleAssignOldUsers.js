import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { assignRole } from "../../appRedux/actions/supr";
import { searchUsers, deleteUser } from "../../appRedux/actions/general";
import Spinner from "../layout/Spinner";

const RoleAssignOldUsers = ({ searchUsers, deleteUser, assignRole, search, loading }) => {

  const [formData, setFormData] = useState({
    list: [],
    users: [],
    user: ""
  });

  const { users, user, list } = formData;

  const onSearch = e => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
    searchUsers(e.target.value);
  }

  const addMember = e => {
    if (!list.includes(e.target.value)) {
      list.push(e.target.value);
      setFormData({ ...formData, list });
    }

  }

  const removeMember = e => {
    const removeIndex = list.map(member => member.toString())
      .indexOf(e);
    list.splice(removeIndex, 1);
    setFormData({ ...formData, list });
  }

  const addRole = (role, _id) => {
    const record = {
      id: _id,
      role: role,
    };
    users.push(record);
  };

  const AssignRole = (Id) => {
    for (let i = 0; i < users.length; i++)
      if (users[i].id === Id) {
        const id = users[i].id;
        const role = users[i].role;
        assignRole(id, role);
      }
  };

  const removeUser = (id) => {
    if (window.confirm("Click OK to remove the user from the system!"))
      deleteUser(id);
  }

  return (
    <div className="setSession">
      <div className="setSession--2">
        <label className="dropdown-label">Search users</label>
        <div class="dropdown">
          <div className="dropdown-div"></div>
          <i className="dropdown-div-search fa fa-search"></i>
          <input
            id="memberinput"
            type="search"
            className="dropdown-div-input"
            name="user"
            value={user}
            autoComplete="off"
            onChange={(e) => {
              onSearch(e);
            }}
          />
          <div
            name="list"
            value={list}
            className="dropdown-select" >
            {search.map(user => {
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
            <text className="dropdown-text">Users</text>
            <ul className="check-list">
              {search.map(member => {
                if (list.includes(member._id))
                  return (
                    <li
                      key={member._id}>
                      {member.idNum} {member.name} {member.surname}
                      <select type="text" name="searchMember" onChange={(e) => addRole(e.target.value, member._id)}>
                        <option value={""}>Assign Role</option>
                        <option key={"instructor"} value={"instructor"}>Instructor</option>
                        <option key={"student"} value={"student"}>Student</option>
                        <option key={"coordinator"} value={"coordinator"}>coordinator</option>
                        <option key={"external"} value={"external"}>external</option>
                        <option key={"assistant"} value={"assistant"}>assistant</option>
                        <option key={"chair"} value={"chair"}>chair</option>
                        <option key={user._id} value={null}>null</option>
                      </select>
                      <button
                        className="btn-approve btn-secondary"
                        name="members"
                        onClick={() => AssignRole(member._id)}>
                        <span>Assign</span></button>
                      <button
                        className="btn-cancel btn-secondary"
                        name="members"
                        onClick={() => removeUser(member._id)}>
                        <span>remove</span></button>
                      <button
                        className="btn-cancel btn-secondary"
                        name="members"
                        onClick={() => removeMember(member._id)}>
                        <span>X</span></button>
                    </li>
                  )
              })}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

RoleAssignOldUsers.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  search: state.general.search,
  loading: state.supr.loading,
});

export default connect(mapStateToProps, { deleteUser, assignRole, searchUsers })(
  RoleAssignOldUsers
);
