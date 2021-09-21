import React, { useState, useEffect } from "react";
import {
  authService,
  dbService,
  realtimeDatabase,
  storageService,
} from "../fbase";
import { useHistory } from "react-router-dom";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import LazyImageLoading from "../components/LazyImageLoading";
import { useParams } from "react-router";
import Nweet from "../components/Nweet";
import UserRow from "../components/UserRow";

export default ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState("");
  const [isMe, setIsMe] = useState(false);
  const [username, setUsername] = useState("");
  const [userFeed, setUserFeed] = useState([]);
  const { uid } = useParams();

  useEffect(async () => {
    // dbService
    //   .collection("profile")
    //   .doc(userObj.uid)
    //   .get()
    //   .then(function (doc) {
    //     if (doc.exists) {
    //       profileImgUrl = doc.data().attachmentUrl;
    //       setAttachment(profileImgUrl);
    //     }
    //   });

    await realtimeDatabase
      .ref("users/" + uid)
      .once("value", function (snapshot) {
        let userData = snapshot.val();
        setIsMe(uid === userData.uid);
        setUsername(userData.username);
        snapshot.forEach(function (childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          if (childKey === "avatar") {
            setAttachment(childData);
          }
        });
      });

    // my feeds
    await dbService
      .collection(uid)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const feedArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserFeed((followNweet) => {
          let allNweets = [...feedArray];
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
          console.log(unq);
          return unq;
        });
      });
  }, []);

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });

      refreshUser();
    }
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`profile/${userObj.uid}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
      await dbService.doc(`profile/${userObj.uid}`).delete();
      await realtimeDatabase
        .ref(`users/${userObj.uid}`)
        .update({ avatar: attachmentUrl });
    }

    // const profileArray = {
    //   id: userObj.uid,
    //   attachmentUrl,
    // };
    // await dbService.collection("profile").doc(userObj.uid).set(profileArray);
    history.push("/");
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => setAttachment(null);

  const getFollowing = async () => {
    let follow = {};
    await realtimeDatabase
      .ref("users/" + uid)
      .once("value", function (snapshot) {
        let userData = snapshot.val();
        follow = userData.follow;
      });
    return follow.map(async (follow) => {
      await realtimeDatabase
        .ref("users/" + follow)
        .once("value", function (snapshot) {
          let userData = snapshot.val();
          return <UserRow {...userData} userObj={userObj} />;
        });
    });
  };

  return (
    <div className='profileContainer column'>
      <form onSubmit={onSubmit} className='profileForm column'>
        <div className='profileImg_container column'>
          <label for='attach-file' className='PofileInput__label'>
            <div className='column'>
              {attachment ? (
                <LazyImageLoading
                  width={200}
                  className='profileImg'
                  image={attachment}
                />
              ) : (
                <LazyImageLoading
                  className='profileImg'
                  image={`https://avatars.dicebear.com/api/croodles-neutral/:${userObj.displayName}.svg`}
                />
              )}
              <span className='span_upload'>Change Avatar</span>
            </div>
          </label>

          <input
            id='attach-file'
            type='file'
            accept='image/*'
            onChange={onFileChange}
            style={{
              display: "none",
            }}
          />
        </div>

        <div className='column username_container'>
          <input
            onChange={onChange}
            type='text'
            placeholder='Username'
            value={newDisplayName}
            className='formInput'
          />
          <input type='submit' value='Update' className='formBtn' />
        </div>
      </form>

      <button onClick={onLogOutClick} className='logOut'>
        <FontAwesomeIcon icon={faSignOutAlt} />
      </button>

      <div className='following column'>{getFollowing()}</div>

      <div className='feeds column'>
        <h1>{username}'s feed</h1>
        {userFeed.length !== 0 &&
          userFeed.map((feed) => (
            <Nweet
              key={feed.id}
              nweetObj={feed}
              isOwner={isMe}
              userObj={userObj}
            />
          ))}
      </div>
    </div>
  );
};
