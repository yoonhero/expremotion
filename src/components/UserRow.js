import React, { useState, useEffect } from "react";
import { realtimeDatabase } from "../fbase";
import { useHistory } from "react-router-dom";
import "./UserRow.css";
import LazyImageLoading from "./LazyImageLoading";
import { Link } from "react-router-dom";

const UserRow = ({ uid, avatar, username, userObj }) => {
  const [follows, setFollows] = useState(false);
  const [isMe, setIsMe] = useState(false);
  const history = useHistory();

  const getButton = async () => {
    await realtimeDatabase
      .ref(`users/${userObj.uid}/follow`)
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val() == uid) {
            setFollows(true);
            return;
          }
        });
      });
  };

  const goToProfile = () => {
    history.push(`/profile/${uid}`);
  };

  useEffect(async () => {
    setIsMe(uid == userObj.uid);
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
    <div className='user_row' key={uid}>
      <div className='row'>
        <Link to={`/profile/${uid}`}>
          <LazyImageLoading
            className='avatar'
            image={
              avatar != undefined
                ? avatar
                : `https://avatars.dicebear.com/api/croodles-neutral/:${username}.svg`
            }
          />
        </Link>
        <Link to={`/profile/${uid}`}>
          <div className='username'>{username}</div>
        </Link>
      </div>
      {!isMe ? (
        <button
          className={`follow_button ${follows ? "follow" : "unfollow"}`}
          onClick={() => follow()}>
          {follows ? "UnFollow" : "Follow"}
        </button>
      ) : (
        <button className='follow_button profile' onClick={() => goToProfile()}>
          Profile
        </button>
      )}
    </div>
  );
};

export default UserRow;
