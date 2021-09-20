import React from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";

export const LoggedInLayout = ({ children, screenName, userObj }) => {
  return (
    <main
      style={{
        width: "100%",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
      }}>
      {/* <Header /> */}
      <Navigation screenName={screenName} userObj={userObj} />
      {children}
    </main>
  );
};

export const LoggedOutLayout = ({ children }) => {
  return (
    <main
      style={{
        width: "100%",
        height: "100vh",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
      }}>
      {children}
    </main>
  );
};
