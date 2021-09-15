import React from "react";
import Navigation from "./components/Navigation";

export const LoggedInLayout = ({ children }) => {
  return (
    <main
      style={{
        width: "100%",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
      }}>
      {<Navigation />}
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
