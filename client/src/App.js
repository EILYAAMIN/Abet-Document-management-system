import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./sass/main.scss";
//Redux
import { Provider } from "react-redux";
import { loadUser } from "./appRedux/actions/auth";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/routing/PrivateRoute";

import Sidebar from "./components/siderbar/Sidebar";
import MainPage from "./components/layout/MainPage";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/layout/Dashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ConfirmEmail from "./components/auth/ConfirmEmail";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Navbar from "./components/navbar/Navbar";
import Creategroup from "./components/group/student/CreateGroup";
import Editgroup from "./components/group/student/EditGroup";
import RequestsSTD from "./components/group/student/Requests";
import Groups from "./components/group/instructor/Groups";
import Outcome from "./components/outcome/Outcome";
import RequestsInst from "./components/group/instructor/Requests";
import SessionHandler from "./components/event/SessionHandler";
import Sessions from "./components/event/Sessions";
import Session from "./components/event/Session";
import Evaluate from "./components/event/Evaluate";
import RoleAssignNewUsers from "./components/roles/RoleAssignNewUsers";
import RoleAssignOldUsers from "./components/roles/RoleAssignOldUsers";
import TopicHandler from './components/topic/TopicHandler';
import TopicApprove from './components/topic/TopicApprove';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Alert />
          <Sidebar />
          <Route exact path="/" component={MainPage} />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path='/confirmEmail' component={ConfirmEmail} />
            <Route exact path='/forgotPassword' component={ForgotPassword} />
            <Route exact path='/ResetPassword' component={ResetPassword} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact role="student" path="/createGroup" component={Creategroup} />
            <PrivateRoute exact role="student" path="/editGroup" component={Editgroup} />
            <PrivateRoute exact role="student" path="/requests" component={RequestsSTD} />
            <PrivateRoute exact role="instructor" role2="coordinator" path="/groups" component={Groups} />
            <PrivateRoute exact role="instructor" role2="coordinator"  path="/unapprovedgroups" component={RequestsInst} />
            <PrivateRoute exact role="coordinator" path="/addEvent" component={SessionHandler} />
            <PrivateRoute exact role="instructor" role2="external" role3="coordinator" role4="chair" path="/sessions" component={Sessions} />
            <PrivateRoute exact role="instructor" role2="external" role3="coordinator" role4="chair" path="/session/:id" component={Session} />
            <PrivateRoute exact role="instructor" role2="external" role3="coordinator" role4="chair" 
            path="/session/:id/:student" component={Evaluate} />
            <PrivateRoute exact role2="coordinator" path="/rolesNew" component={RoleAssignNewUsers} />
            <PrivateRoute exact role2="coordinator" path="/rolesUsers" component={RoleAssignOldUsers} />
            <PrivateRoute exact role="chair" role2="coordinator" path="/outcome" component={Outcome} />
            <PrivateRoute exact role="instructor" role2="coordinator" path="/TopicHandler" component={TopicHandler} />
            <PrivateRoute exact role="chair" role2="coordinator" path="/TopicApprove" component={TopicApprove} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
