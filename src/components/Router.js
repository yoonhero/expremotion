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
          <Route exact path='/'>
            <LoggedOutLayout>
              <Auth />
            </LoggedOutLayout>
          </Route>
        )}
        <Route exact path='/'>
          <LoggedInLayout screenName='home'>
            <Home userObj={userObj} />
          </LoggedInLayout>
        </Route>
        <Route path='/profile'>
          <LoggedInLayout screenName='profile'>
            <Profile userObj={userObj} refreshUser={refreshUser} />
          </LoggedInLayout>
        </Route>
        <Route path='/search'>
          <LoggedInLayout screenName='search'>
            <SearchUser userObj={userObj} />
          </LoggedInLayout>
        </Route>
        <Route path='/comment/:id/'>
          <LoggedInLayout>
            <Comment userObj={userObj} />
          </LoggedInLayout>
        </Route>
        <Route path='/uploads'>
          <LoggedInLayout>
            <Uploads userObj={userObj} />
          </LoggedInLayout>
        </Route>
      </Switch>
    </Router>
  );
};
export default AppRouter;
