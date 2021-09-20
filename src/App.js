import React, { useState, useEffect } from "react";
import AppRouter from "./components/Router";
import { authService, realtimeDatabase } from "./fbase";
import Loading from "./routes/Loading";
import GlobalStyles from "./reset";
import "./styles.css";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName ? user.displayName : user.email,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });

        realtimeDatabase.ref("users/" + user.uid).update({
          username: user.displayName ? user.displayName : user.email,
          email: user.email,
          uid: user.uid,
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
      <GlobalStyles />
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        <Loading />
      )}
    </>
  );
}

export default App;
