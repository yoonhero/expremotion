import React, { useState, useEffect } from "react";
import { realtimeDatabase } from "../fbase";

const Notification = async ({ userObj }) => {
  // let notifs = [];
  // await realtimeDatabase
  //   .ref("notif/" + userObj.uid)
  //   .once("value", function (snapshot) {
  //     let allNotif = [];
  //     snapshot.forEach((value) => {
  //       allNotif = [value.val(), ...allNotif];
  //     });
  //     let sorted = allNotif.sort(function (a, b) {
  //       return b.createdAt - a.createdAt;
  //     });
  //     notifs = sorted;
  //   });
  // if (!notifs) {
  //   return (
  //     <div>
  //       <h1>There was Nothing ㅠㅠ</h1>
  //     </div>
  //   );
  // }
  // return notifs.map((notif) => (
  //   <div>
  //     <h1>{notif?.username}</h1>
  //     <span>{notif?.contents}</span>
  //   </div>
  // ));
  return <div>notification</div>;
};

export default Notification;

export const NewNotif = async (username, contents, targetUid) => {
  console.log(username, contents);
  let notifs = [];
  await realtimeDatabase
    .ref("notif/" + targetUid)
    .once("value", function (snap) {
      let allNotif = [];
      snap.forEach((value) => {
        allNotif = [value.val(), ...allNotif];
      });
      let sorted = allNotif.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });
      notifs = sorted;
    });
  let newNotif = {
    id: notifs.length,
    createdAt: Date.now(),
    username: username,
    contents,
  };
  await realtimeDatabase
    .ref(`notif/${targetUid}`)
    .update([...notifs, newNotif]);
};
