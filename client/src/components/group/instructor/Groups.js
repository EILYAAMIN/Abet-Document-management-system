import React, { Fragment, useEffect } from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withdrawGroups } from "../../../appRedux/actions/group";
import { getMyGroups } from "../../../appRedux/actions/group";
import Spinner from "../../layout/Spinner";

const Groups = ({ getMyGroups, withdrawGroups, group: { groups, loading } }) => {
    useEffect(() => {
        getMyGroups();
    }, [getMyGroups]);

    const withdraw = async (id) => {
        if (window.confirm("Click OK to remove the group from your Groups List!")) {
            await withdrawGroups(id);
            getMyGroups();
        }
    }



    return (loading ?
        <Spinner />
        :
        <Fragment>
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
                        {groups.length > 0 ? groups.map(group => {
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
                                            <button className="btn-cancel btn-primary" onClick={() => withdraw(group._id)}>
                                                <span>
                                                    Remove
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
        </Fragment>
    )
};

Groups.propTypes = {
    group: PropTypes.object.isRequired,
    getMyGroups: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    group: state.group
});

export default connect(mapStateToProps, { getMyGroups, withdrawGroups })(Groups);
