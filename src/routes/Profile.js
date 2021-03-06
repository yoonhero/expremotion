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
import { faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log(username, attachment);
  }, [username, attachment]);

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
        console.log(userData);
        setIsMe(userObj.uid === userData.uid);
        setUsername(userData.username);
        setAttachment(userData.avatar);
        // snapshot.forEach(function (childSnapshot) {
        //   var childKey = childSnapshot.key;
        //   var childData = childSnapshot.val();
        //   if (childKey === "avatar") {
        //     setAttachment(childData);
        //   }
        // });
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

  const GetFollowing = async () => {
    // return await realtimeDatabase
    //   .ref("users/" + uid)
    //   .once("value", function (snapshot) {
    //     let userData = snapshot.val();
    //     if (userData.length === 0 || userData === undefined) {
    //       return;
    //     }
    //     return userData?.follow.map(async (follow) => {
    //       return await realtimeDatabase
    //         .ref("users/" + follow)
    //         .once("value", function (snapshot) {
    //           let userData = snapshot.val();
    //           return <UserRow {...userData} userObj={userObj} />;
    //         });
    //     });
    //   });
    return <h1>follos</h1>;
  };

  return (
    <div className='profileContainer column'>
      {isEditing && isMe ? (
        <form onSubmit={onSubmit} className='profileForm column'>
          <div className='profileImg_container column'>
            <label for='attach-file' className='PofileInput__label'>
              <div className='column'>
                {attachment ? (
                  <LazyImageLoading className='profileImg' image={attachment} />
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

          <button
            className='cancel_button'
            onClick={() => setIsEditing((edit) => !edit)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </form>
      ) : (
        <div className='column main_profile_container'>
          <div className='row top_column'>
            {attachment ? (
              <LazyImageLoading className='profile_avatar' image={attachment} />
            ) : (
              <LazyImageLoading
                className='profile_avatar'
                image={`https://avatars.dicebear.com/api/croodles-neutral/:${userObj.displayName}.svg`}
              />
            )}
            {isMe && (
              <button
                className='edit_button'
                onClick={() => setIsEditing((edit) => !edit)}>
                Edit Profile
              </button>
            )}
            {!isMe && (
              <button
                className='edit_button'
                onClick={() => alert("coming soon...")}>
                follow
              </button>
            )}
          </div>
          <div className='column user_info_container'>
            <h1>{username}</h1>
            <span>@{uid}</span>
            {/* <button>dm</button> */}
          </div>
        </div>
      )}

      {isMe && (
        <button onClick={onLogOutClick} className='logOut'>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      )}

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
