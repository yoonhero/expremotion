import React, { useState, useEffect } from "react";
import {
  authService,
  dbService,
  realtimeDatabase,
  storageService,
} from "../fbase";
import { useHistory } from "react-router-dom";

export default ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState("");
  let profileImgUrl = "";
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
    }

    // const profileArray = {
    //   id: userObj.uid,
    //   attachmentUrl,
    // };
    await realtimeDatabase
      .ref(`users/${userObj.uid}`)
      .update({ avatar: attachmentUrl });
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
    <div className='profileContainer'>
      <form onSubmit={onSubmit} className='profileForm'>
        <label for='attach-file' className='PofileInput__label'>
          <div className='img-thumbnail img-circle'>
            <div>
              {attachment ? (
                <img className='profileImg' src={attachment} />
              ) : (
                <img
                  className='profileImg'
                  src={`https://avatars.dicebear.com/api/croodles-neutral/:${userObj.displayName}.svg`}
                />
              )}

              <span className='span_upload'>UPLOAD</span>
            </div>
          </div>
        </label>
        <input
          id='attach-file'
          type='file'
          accept='image/*'
          onChange={onFileChange}
          style={{
            opacity: 0,
          }}
        />

        <input
          onChange={onChange}
          type='text'
          autoFocus
          placeholder='Display name'
          value={newDisplayName}
          className='formInput'
        />
        <input type='submit' value='Update Profile' className='formBtn' />
      </form>

      <button onClick={onLogOutClick} className='logOut'>
        log out
      </button>
    </div>
  );
};
