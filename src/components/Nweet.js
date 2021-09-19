import React, { useState, useEffect } from "react";
import { dbService, realtimeDatabase, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencilAlt,
  faComment,
  faShare,
  faCheck,
  faTimes,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router";
import "./Feed.css";
import Modal from "react-modal";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import LazyImageLoading from "./LazyImageLoading";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "none",
    padding: "0",
    background: "transparent",
  },
};

const Nweet = ({ nweetObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [reply, setReply] = useState();
  const [newReply, setNewReply] = useState("");
  const [avatar, setAvatar] = useState("");
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const [createdAt, setCreatedAt] = useState("");

  const toggleAction = () => setModal((modal) => !modal);

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
    let date = new Date(nweetObj.createdAt);
    setCreatedAt(`${date.getMonth()}월 ${date.getDate()}일`);
  }, []);

  useEffect(async () => {
    if (modal) {
      return disableBodyScroll(document.getElementById("root"));
    }
    return enableBodyScroll(document.getElementById("root"));
  }, [modal]);

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
    setModal(false);
    const ok = window.confirm("Are you sure you want to delete this feed?");
    if (ok) {
      await dbService.doc(`${userObj.uid}/${nweetObj.id}`).delete();
      if (nweetObj.attachmentUrl !== "") {
        await storageService.refFromURL(nweetObj.attachmentUrl).delete();
      }
      await realtimeDatabase.ref(`reply/${nweetObj.id}`).remove();
    }
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
    setModal(false);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`${userObj.uid}/${nweetObj.id}`).update({
      text: newNweet,
    });
    nweetObj.text = newNweet;
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
    <div className='feed'>
      <>
        <Modal
          isOpen={modal}
          onRequestClose={toggleAction}
          style={customStyles}
          contentLabel='Actions'>
          <div className='column modal_contents'>
            <button
              onClick={onDeleteClick}
              className='modal_button delete_btn first_btn'>
              {/* <span>
                <FontAwesomeIcon icon={faTrash} />
              </span> */}
              <span>삭제</span>
            </button>
            <button onClick={toggleEditing} className='modal_button'>
              {/* <span>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span> */}
              <span>수정</span>
            </button>
            <button
              onClick={() => setModal(false)}
              className='modal_button last_btn'>
              취소
            </button>
          </div>
        </Modal>
        <div className='feed_header'>
          <div className='user_info'>
            <LazyImageLoading
              className='avatar'
              image={
                avatar != ""
                  ? avatar
                  : `https://avatars.dicebear.com/api/croodles-neutral/:${nweetObj.creatorId}.svg`
              }
            />
            <span className='username'>{nweetObj.username}</span>
            <span className=''>·</span>
            <h4 className='date'>{createdAt}</h4>
          </div>
          <div clsasName=' row'>
            {isOwner && (
              <div class='nweet__actions'>
                <span onClick={toggleAction}>
                  <FontAwesomeIcon icon={faEllipsisH} />
                </span>
                {/* <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} color='#000' />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} color='#000' />
                </span> */}
              </div>
            )}
          </div>
        </div>
        <section className='main_section'>
          {editing ? (
            <>
              <form onSubmit={onSubmit} className='column edit_feed'>
                <textarea
                  type='text'
                  placeholder='Edit your Feed'
                  value={newNweet}
                  required
                  autoFocus
                  onChange={onChange}
                  className='edit_input'
                />
                <div className='row edit_feed_buttons'>
                  <button type='submit' className='edit_feed_button'>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button
                    onClick={toggleEditing}
                    className='cancelBtn edit_feed_button'>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <span class='feed_text'>{nweetObj.text}</span>
          )}
          {nweetObj.attachmentUrl && (
            <LazyImageLoading
              image={nweetObj.attachmentUrl}
              className='feed_img'
            />
          )}
        </section>

        <section className='feed_actions'>
          <button onClick={() => seeMoreComments()}>
            <FontAwesomeIcon icon={faComment} />
            <span>{reply && reply.length}</span>
          </button>
          <button>
            <FontAwesomeIcon icon={faShare} />
          </button>
        </section>

        {/* <form onSubmit={onReplySubmit}>
            <input type='text' value={newReply} onChange={onNewReplyChange} />
          </form>
          <span>comments</span> */}
        {/* {reply &&
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
            })} */}
      </>
    </div>
  );
};

export default Nweet;
