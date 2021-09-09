import React, { useState, useEffect } from "react";
import { dbService, realtimeDatabase, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router";

const Nweet = ({ nweetObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [reply, setReply] = useState();
  const [newReply, setNewReply] = useState("");
  const [avatar, setAvatar] = useState("");
  const history = useHistory();

  useEffect(async () => {
    await realtimeDatabase
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
    await realtimeDatabase.ref(`reply/${nweetObj.id}`).on("value", (snap) => {
      let allReply = [];
      snap.forEach((value) => {
        allReply = [...allReply, value.val()];
      });
      setReply(allReply);
    });
  }, []);

  const onNewReplyChange = (event) => {
    setNewReply(event.target.value);
  };

  const onReplySubmit = async (event) => {
    event.preventDefault();
    let newReplyObject = {
      id: reply.length,
      createdAt: Date.now(),
      reply: newReply,
      username: userObj.displayName,
      creatorId: userObj.uid,
    };
    await realtimeDatabase
      .ref(`reply/${nweetObj.id}`)
      .update([...reply, newReplyObject]);
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`${userObj.uid}/${nweetObj.id}`).delete();
      if (nweetObj.attachmentUrl !== "") {
        await storageService.refFromURL(nweetObj.attachmentUrl).delete();
      }
      await realtimeDatabase.ref(`reply/${nweetObj.id}`).remove();
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

  const seeMoreComments = () => history.push(`/comment/${nweetObj.id}`);

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
          <h2>{nweetObj.username}</h2>
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
          <form onSubmit={onReplySubmit}>
            <input type='text' value={newReply} onChange={onNewReplyChange} />
          </form>
          {reply &&
            reply.map((comment, index) => {
              if (index >= 3) {
                return;
              }
              return (
                <>
                  <div key={comment.id}>
                    <p>{comment.username}</p>
                    <p>{comment.reply}</p>
                  </div>
                  <hr />
                </>
              );
            })}
          <button onClick={() => seeMoreComments()}>more comments...</button>
          <hr />
        </>
      )}
    </div>
  );
};

export default Nweet;
