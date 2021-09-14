import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import Auth from "../routes/Auth";
import SearchUser from "../routes/Search";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Comment from "../routes/Comment";
import Navigation from "./Navigation";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Switch>
        {isLoggedIn ? (
          <main
            style={{
              width: "100%",
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
            }}>
            <Route exact path='/'>
              <Home userObj={userObj} />
            </Route>
            <Route exact path='/profile'>
              <Profile userObj={userObj} refreshUser={refreshUser} />
            </Route>
            <Route exact path='/search'>
              <SearchUser userObj={userObj} />
            </Route>
            <Route exact path='/comment/:id/'>
              <Comment userObj={userObj} />
            </Route>
          </main>
        ) : (
          <main
            style={{
              width: "100%",
              height: "100vh",
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
            }}>
            <Route exact path='/'>
              <Auth />
            </Route>
          </main>
        )}
      </Switch>
    </Router>
  );
};
export default AppRouter;
