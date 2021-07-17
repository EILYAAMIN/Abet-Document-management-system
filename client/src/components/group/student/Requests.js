import React, { Fragment, useEffect } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRequestingGroups } from '../../../appRedux/actions/group';
import { getTopicsPUB } from '../../../appRedux/actions/topic';
import { approveGroup } from '../../../appRedux/actions/group';
import { cancelGroup } from '../../../appRedux/actions/group';
import Spinner from '../../layout/Spinner';
import { Link } from 'react-router-dom';


const Requests = ({ getRequestingGroups, approveGroup, getTopicsPUB, isAuthenticated,
    cancelGroup, topics, group: { requests, loading } }) => {
    useEffect(() => {
        getRequestingGroups();
        getTopicsPUB();
    }, [getRequestingGroups, getTopicsPUB]);

    const approve = async (id) => {
        await approveGroup(id);
        getRequestingGroups();
    }

    const cancel = async (id) => {
        await cancelGroup(id);
        getRequestingGroups();
    }

    return (loading ?
        <Spinner /> :
        (requests.length > 0 && isAuthenticated ?
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
                            {requests.length > 0 && !requests.includes(null) ? requests.map(group => {
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
                                                <div className="grouprecord-text--5">
                                                    <button className="btn-secondary btn-approve" onClick={() => approve(group._id)}>approve</button>
                                                    <button className="btn-secondary btn-cancel" onClick={() => cancel(group._id)}>decline</button>
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
                </div>
            </Fragment> :
            <Fragment>
                <div className="dashboard">
                    <text className="dashboard-text">No requests</text>
                </div>
            </Fragment>
        )
    )
}

Requests.propTypes = {
    topics: PropTypes.object.isRequired,
    getRequestingGroups: PropTypes.func.isRequired,
    group: PropTypes.object.isRequired,
    loading: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    topics: state.topic.topics,
    group: state.group,
    loading: state.auth.loading,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(
    mapStateToProps,
    { getRequestingGroups, approveGroup, cancelGroup, getTopicsPUB }
)(Requests);
