import React, { useState, useEffect } from "react";
import { dbService, firebaseInstance, realtimeDatabase } from "../fbase";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);

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
    setNweets([]);

    // find user's follower
    let follows = [];
    await realtimeDatabase
      .ref(`users/${userObj.uid}/follow`)
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          follows.push(childSnapshot.val());
        });
      });

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

    // my feeds
    await dbService
      .collection(userObj.uid)
      .orderBy("createdAt", "desc")
      .limit(10)
      .onSnapshot((snapshot) => NweetsHook(snapshot));
  }, []);

  return (
    <div className='container'>
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
