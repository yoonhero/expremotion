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

export default ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
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

    realtimeDatabase
      .ref("users/" + userObj.uid)
      .once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          if (childKey === "avatar") {
            setAttachment(childData);
          }
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
    </div>
  );
};
