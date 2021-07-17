import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { getNullRoleUsers, assignRole } from "../../appRedux/actions/supr";
import { deleteUser } from "../../appRedux/actions/general";
import Spinner from "../layout/Spinner";

const RoleAssignNewUsers = ({ getNullRoleUsers, deleteUser, assignRole, users, loading }) => {
  useEffect(() => {
    getNullRoleUsers();
  }, [getNullRoleUsers]);

  const [formData] = useState({
    list: [
      {
        id: "",
        role: "",
      },
    ],
  });

  const { list } = formData;

  const addRole = (role, id) => {
    const record = {
      id: id,
      role: role,
    };
    list.push(record);
  };

  const AssignRole = (Id) => {
    for (let i = 0; i < list.length; i++)
      if (list[i].id === Id) {
        const id = list[i].id;
        const role = list[i].role;
        assignRole(id, role);
      }
  };

  const removeUser = (id) => {
    deleteUser(id);
  }

  return (
    <div className="container">
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="table">
            <div className="table-header">
              <div className="header__item"><text id="name" className="filter__link">name</text></div>
              <div className="header__item"><text id="wins" className="filter__link filter__link--number">surname</text></div>
              <div className="header__item"><text id="draws" className="filter__link filter__link--number">ID</text></div>
              <div className="header__item"><text id="total" className="filter__link filter__link--number">OPTIONS</text></div>
            </div>
            {users.length > 0 && !loading ? users.map(user => {
              return (
                <div className="table-content">
                  <div className="table-row">
                    <div className="table-data">{user.name}</div>
                    <div className="table-data">{user.surname}</div>
                    <div className="table-data">{user.idNum}</div>
                    <div>
                      <select className="btn-primary select" type="text" name="searchMember"
                        onChange={(e) => addRole(e.target.value, user._id)}>
                        <option value={""}>Assign Role</option>
                        <option value={"instructor"}>Instructor</option>
                        <option value={"student"}>Student</option>
                        <option value={"coordinator"}>coordinator </option>
                        <option value={"external"}>external </option>
                        <option value={"assistant"}>assistant </option>
                        <option value={"chair"}>chair </option>
                        <option value={null}>null </option>
                      </select>
                      <div>
                        <button className="btn-primary btn-approve" onClick={() => AssignRole(user._id)}>Assign</button>
                        <button className="btn-primary btn-cancel" onClick={() => removeUser(user._id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
              : null
            }
          </div>
        </div>
      )}
    </div>
  );
};

RoleAssignNewUsers.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  users: state.supr.users,
  loading: state.supr.loading,
});

export default connect(mapStateToProps, { getNullRoleUsers, deleteUser, assignRole })(
  RoleAssignNewUsers
);
