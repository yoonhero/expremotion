import React from "react";
import { realtimeDatabase } from "../fbase";

const UserRow = ({ uid, avatar, username, userObj }) => {
  const followButton = async () => {
    // await realtimeDatabase
    //   .ref(`users/${userUid}/follow`)
    //   .once("value", (snapshot) => {
    //     follow = snapshot.val();
    //   });
    // if (follow.includes(userUid)) {
    //   return <button>unfollow</button>;
    return <button>follow</button>;
  };
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
    alreadyFollow.map((auid) => {
      if (auid == uid) {
        isDup = true;
        return;
      }
    });
    if (!isDup) {
      newFollow = [...alreadyFollow, uid];
    }

    await realtimeDatabase.ref(`users/${userObj.uid}/follow`).update(newFollow);
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
      <button onClick={() => follow()}>follow</button>
    </div>
  );
};

export default UserRow;
