import React, { useState, useEffect } from "react";
import { realtimeDatabase } from "../fbase";

const UserRow = ({ uid, avatar, username, userObj }) => {
  const [follows, setFollows] = useState(false);

  const getButton = async () => {
    await realtimeDatabase
      .ref(`users/${userObj.uid}/follow`)
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          console.log(childSnapshot.val());
          if (childSnapshot.val() == uid) {
            setFollows(true);
            return;
          }
        });
      });
  };

  useEffect(async () => {
    await getButton();
  }, []);

  const follow = async () => {
    let alreadyFollow = [];
    await realtimeDatabase
      .ref(`users/${userObj.uid}/follow`)
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          alreadyFollow.push(childSnapshot.val());
        });
      });

    let newFollow = [];
    let isDup = false;
    alreadyFollow.map((auid, i) => {
      if (auid == uid) {
        isDup = true;
        alreadyFollow.splice(i, 1);
        return;
      }
    });
    if (!isDup) {
      newFollow = [...alreadyFollow, uid];
    } else {
      newFollow = [...alreadyFollow];
    }

    await realtimeDatabase.ref(`users/${userObj.uid}/follow`).set(newFollow);
    setFollows(false);
    await getButton();
  };

  return (
    <div key={uid}>
      <img
        width={100}
        src={
          avatar != ""
            ? avatar
            : `https://avatars.dicebear.com/api/croodles-neutral/:${username}.svg`
        }
      />
      <div>{username}</div>
      <button onClick={() => follow()}>
        {follows ? "UnFollow" : "Follow"}
      </button>
    </div>
  );
};

export default UserRow;
