import React, { useState, useEffect } from "react";
import { dbService, realtimeDatabase, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  // useEffect(() => {
  //   let svg = createAvatar(style, {
  //     seed: "yoonhero",
  //     // ... and other options
  //   });
  //   setAvatar(svg)
  // }, []);

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    // dbService.collection("profile").onSnapshot((snapshot) => {
    //   snapshot.docs.map((doc) => {
    //     if (doc.data().id == nweetObj.creatorId) {
    //       setAvatar(doc.data().attachmentUrl);
    //       return;
    //     }
    //   });
    // });
    realtimeDatabase
      .ref(`users/${nweetObj.creatorId}`)
      .once("value", (snapshot) => {
        snapshot.forEach(function (childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          if (childKey === "avatar") {
            setAvatar(childData);
            return;
          }
        });
      });
  }, []);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      if (nweetObj.attachmentUrl !== "") {
        await storageService.refFromURL(nweetObj.attachmentUrl).delete();
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  return (
    <div className='nweet'>
      {editing ? (
        <>
          <form onSubmit={onSubmit} className='container nweetEdit'>
            <input
              type='text'
              placeholder='Edit your nweet'
              value={newNweet}
              required
              autoFocus
              onChange={onChange}
              className='formInput'
            />
            <input type='submit' value='Update Nweet' className='formBtn' />
          </form>

          <span onClick={toggleEditing} className='formBtn cancelBtn'>
            Cancel
          </span>
        </>
      ) : (
        <>
          <img
            width={30}
            src={
              avatar != ""
                ? avatar
                : `https://avatars.dicebear.com/api/croodles-neutral/:${nweetObj.creatorId}.svg`
            }
          />
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img width={200} src={nweetObj.attachmentUrl} />
          )}
          {isOwner && (
            <div class='nweet__actions'>
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} color='#000' />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} color='#000' />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
