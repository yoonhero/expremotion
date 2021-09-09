import React, { useState, useEffect } from "react";
import { dbService, firebaseInstance, realtimeDatabase } from "../fbase";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  useEffect(async () => {
    setNweets([]);
    let follows = [];
    await realtimeDatabase
      .ref(`users/${userObj.uid}/follow`)
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          follows.push(childSnapshot.val());
        });
      });

    follows.map(async (follow) => {
      await dbService
        .collection(follow)
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          const nweetArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setNweets((followNweet) => {
            let allNweets = [...followNweet, ...nweetArray];
            let sorted = allNweets.sort(function (a, b) {
              return b.createdAt - a.createdAt;
            });
            return sorted;
          });
        });
    });
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
