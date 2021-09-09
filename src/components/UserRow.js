import React from "react";
import { realtimeDatabase } from "../fbase";

const UserRow = ({ uid, avatar, username }) => {
  // const followButton = async (uid) => {
  //   // try {
  //   //   console.log(userUid);
  //   //   let follow = [];
  //   //   if (userUid == uid) {
  //   //     return <button>edit profile</button>;
  //   //   }
  //   //   await realtimeDatabase
  //   //     .ref(`users/${userUid}/follow`)
  //   //     .once("value", (snapshot) => {
  //   //       follow = snapshot.val();
  //   //     });
  //   //   if (follow.includes(userUid)) {
  //   //     return <button>unfollow</button>;
  //   //   } else {
  //   //     return <button>follow</button>;
  //   //   }
  //   // } catch (err) {
  //   //   return <button>follow</button>;
  //   // }
  // };

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
    </div>
  );
};

export default UserRow;
