import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Auth from "../routes/Auth";
import SearchUser from "../routes/Search";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Comment from "../routes/Comment";
import Uploads from "../routes/Uploads";
import { LoggedInLayout, LoggedOutLayout } from "../Layout";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Router>
      <Switch>
        {!isLoggedIn && (
          <Route path='/'>
            <LoggedOutLayout>
              <Auth />
            </LoggedOutLayout>
          </Route>
        )}
        <Route exact path='/'>
          <LoggedInLayout screenName='home' userObj={userObj}>
            <Home userObj={userObj} />
          </LoggedInLayout>
        </Route>
        <Route path='/profile/:uid'>
          <LoggedInLayout screenName='profile' userObj={userObj}>
            <Profile userObj={userObj} refreshUser={refreshUser} />
          </LoggedInLayout>
        </Route>
        <Route path='/search'>
          <LoggedInLayout screenName='search' userObj={userObj}>
            <SearchUser userObj={userObj} />
          </LoggedInLayout>
        </Route>
        <Route path='/comment/:id/'>
          <LoggedInLayout userObj={userObj}>
            <Comment userObj={userObj} />
          </LoggedInLayout>
        </Route>
        <Route path='/uploads'>
          <LoggedInLayout userObj={userObj}>
            <Uploads userObj={userObj} />
          </LoggedInLayout>
        </Route>
      </Switch>
    </Router>
  );
};
export default AppRouter;
