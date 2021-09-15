import React, { useState, useEffect } from "react";
import { dbService, firebaseInstance, realtimeDatabase } from "../fbase";
import Nweet from "../components/Nweet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";

import "./Home.css";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  const [follows, setFollows] = useState([]);
  const history = useHistory();

  const NweetsHook = (snapshot) => {
    const nweetArray = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setNweets((followNweet) => {
      let allNweets = [...followNweet, ...nweetArray];
      let sorted = allNweets.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });
      // let uniqueArray = sorted.filter(function (item, pos) {
      //   return sorted.indexOf(item) == pos;
      // });

      let uniqueArr = [];
      let unq = [];
      sorted.forEach((element) => {
        if (!uniqueArr.includes(element.id)) {
          uniqueArr.push(element.id);
          unq.push(element);
        }
      });

      return unq;
    });
  };

  useEffect(async () => {
    // other people feeds
    follows.map(async (follow) => {
      if (follow === userObj.uid) {
        return;
      }
      await dbService
        .collection(follow)
        .orderBy("createdAt", "desc")
        .limit(10)
        .onSnapshot((snapshot) => NweetsHook(snapshot));
    });
  }, [follows]);

  useEffect(async () => {
    // find user's follower
    let new_follows = [];
    await realtimeDatabase
      .ref(`users/${userObj.uid}/follow`)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          new_follows.push(childSnapshot.val());
        });
        setFollows(new_follows);
      });

    // my feeds
    await dbService
      .collection(userObj.uid)
      .orderBy("createdAt", "desc")
      .limit(10)
      .onSnapshot((snapshot) => NweetsHook(snapshot));
  }, []);

  const goToUploads = () => {
    history.push("/uploads");
  };

  return (
    <div className='container column'>
      <div className='feeds column'>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
            userObj={userObj}
          />
        ))}
      </div>
      <div className='floatingBtn'>
        <Zoom in={true} timeout={200}>
          <Fab
            color='primary'
            aria-label='Upload'
            onClick={() => goToUploads()}>
            <FontAwesomeIcon icon={faPlus} />
          </Fab>
        </Zoom>
      </div>
    </div>
  );
};
export default Home;
