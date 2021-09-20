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
import {
  EmailShareButton,
  FacebookShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import styled, { keyframes } from "styled-components";
import { Helmet } from "react-helmet";

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

const dropping = keyframes`
  0% {
		transform: translateY(0px) rotate(-90deg);
    
	}
	60% {
		transform: translateY(15px) rotate(-80deg);
	}
	100% {
		transform: translateY(5px) rotate(-95deg);
	}
`;

const firstDropping = keyframes`
0% {
  transform: translateY(0px) rotate(-90deg);
  opacity: 1;  
}
60% {
  transform: translateY(15px) rotate(-80deg);
  opacity: 0.8;
}
100% {
  transform: translateY(2px) rotate(-95deg);
  display: none;
  opacity: 0;
}
`;

const secondDropping = keyframes`
0% {
  
  transform: translateY(3px) rotate(-95deg);
  opacity: 1;
}
40% {
  transform: translateY(10px) rotate(-80deg);
  opacity: 0.8
}
100% {
  transform: translateY(2px) rotate(-90deg);
  opacity: 0;
}
`;

const thirdDropping = keyframes`
0% {
  
  transform: translateY(1px) rotate(-95deg);
  opacity: 1;
}
50% {
  transform: translateY(13px) rotate(-80deg);
  opacity: 0.8
}
100% {
  transform: translateY(4px) rotate(-90deg);
  opacity: 0;
}
`;

const SadMessage = styled.div`
  position: relative;
  width: 100%;
  top: -10px;
  font-size: 10px;
  svg {
    position: relative;
    width: 16px;
    top: 0px;
    transform: rotate(-90deg);
  }
  .first {
    animation: ${firstDropping} 2s ease infinite;
  }

  .second {
    animation: ${secondDropping} 2s ease infinite;
  }
  .third {
    animation: ${thirdDropping} 2s ease infinite;
  }
`;

const spin = keyframes`

100% { 
  -webkit-transform: rotate(360deg); 
  transform:rotate(360deg); 
} `;

const HappyMessage = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 12.5px;
  z-index: -1;
  img {
    z-index: -1;
    width: 65px;
    height: auto;

    -webkit-animation: ${spin} 6s linear infinite;
    -moz-animation: ${spin} 6s linear infinite;
    animation: ${spin} 6s linear infinite;
  }
`;

const FireTextColorChange = keyframes`
  0%{
    color: #FCFE09;
  }
  50% {
    color: #FFC629;
  }
  60%{
    color: #AA1404;
  }
  100%{
    color: #FFC629;
  }
`;

const LottiePlayer = styled.div`
  position: relative;
  display: flex;
  padding: 0;
  color: black;
  overflow: hidden;
  font-size: 16px;
  margin: 0px;
  max-width: 60px;
`;

const Nweet = ({ nweetObj, isOwner, userObj }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [reply, setReply] = useState();
  const [newReply, setNewReply] = useState("");
  const [avatar, setAvatar] = useState("");
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const [createdAt, setCreatedAt] = useState("");
  // const [like, setLike] = useState(0)

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

  // const onLikebuttonClick = async() => {
  //   await realtimeDatabase
  //     .ref(`like/${nweetObj.id}`)
  //     .update([...reply, newReplyObject]);
  // }

  return (
    <div className='feed'>
      <>
        <Helmet>
          <script src='https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'></script>
        </Helmet>
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
        <div className='main_feed'>
          <div className='column'>
            {/* happy sad soso funny shocked angry */}
            <LazyImageLoading
              className='avatar'
              image={
                avatar != ""
                  ? avatar
                  : `https://avatars.dicebear.com/api/croodles-neutral/:${nweetObj.creatorId}.svg`
              }
            />
            {nweetObj.emotion === "sad" ? (
              <SadMessage>
                <svg
                  className='first'
                  width='10px'
                  height='20px'
                  viewBox='0 0 482 297'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <ellipse
                    rx='106.76'
                    ry='143.996'
                    transform='matrix(0.0193094 0.999814 -0.999933 0.0115742 182.388 146.414)'
                    fill='#3A93E4'
                  />
                  <path
                    d='M417.394 122.611C437.234 130.604 437.799 158.471 418.292 166.898L268.946 231.416C253.271 238.188 235.602 226.768 235.255 209.639L232.706 83.9246C232.359 66.796 249.557 54.9911 265.5 61.4144L417.394 122.611Z'
                    fill='#3A93E4'
                  />
                </svg>
                <svg
                  className='second'
                  width='10px'
                  height='20px'
                  viewBox='0 0 482 297'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <ellipse
                    rx='106.76'
                    ry='143.996'
                    transform='matrix(0.0193094 0.999814 -0.999933 0.0115742 182.388 146.414)'
                    fill='#3A93E4'
                  />
                  <path
                    d='M417.394 122.611C437.234 130.604 437.799 158.471 418.292 166.898L268.946 231.416C253.271 238.188 235.602 226.768 235.255 209.639L232.706 83.9246C232.359 66.796 249.557 54.9911 265.5 61.4144L417.394 122.611Z'
                    fill='#3A93E4'
                  />
                </svg>
                <svg
                  className='third'
                  width='10px'
                  height='20px'
                  viewBox='0 0 482 297'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <ellipse
                    rx='106.76'
                    ry='143.996'
                    transform='matrix(0.0193094 0.999814 -0.999933 0.0115742 182.388 146.414)'
                    fill='#3A93E4'
                  />
                  <path
                    d='M417.394 122.611C437.234 130.604 437.799 158.471 418.292 166.898L268.946 231.416C253.271 238.188 235.602 226.768 235.255 209.639L232.706 83.9246C232.359 66.796 249.557 54.9911 265.5 61.4144L417.394 122.611Z'
                    fill='#3A93E4'
                  />
                </svg>
              </SadMessage>
            ) : nweetObj.emotion === "happy" ? (
              <HappyMessage>
                <img src='./sun.svg' />
              </HappyMessage>
            ) : nweetObj.emotion === "angry" ? (
              <LottiePlayer>
                <lottie-player
                  src='https://assets8.lottiefiles.com/private_files/lf30_boznudpc.json'
                  background='transparent'
                  speed='1'
                  loop
                  autoplay></lottie-player>
              </LottiePlayer>
            ) : nweetObj.emotion === "soso" ? (
              // <span className='tracking-out-expand-fwd column'>...</span>
              <LottiePlayer>
                <lottie-player
                  src='https://assets9.lottiefiles.com/datafiles/bEYvzB8QfV3EM9a/data.json'
                  background='transparent'
                  speed='1'
                  loop
                  autoplay></lottie-player>
              </LottiePlayer>
            ) : // <lottie-player
            //   src='https://assets6.lottiefiles.com/packages/lf20_CCQQ7b.json'
            //   background='transparent'
            //   speed='1'

            //   loop
            //   autoplay></lottie-player>
            nweetObj.emotion === "shocked" ? (
              <LottiePlayer>
                <lottie-player
                  src='https://assets3.lottiefiles.com/private_files/lf30_9ce2djcy.json'
                  background='transparent'
                  speed='1'
                  loop
                  autoplay></lottie-player>
              </LottiePlayer>
            ) : (
              nweetObj.emotion === "funny" && (
                <LottiePlayer>
                  <lottie-player
                    src='https://assets10.lottiefiles.com/packages/lf20_ym5ntyv8.json'
                    background='transparent'
                    speed='1'
                    loop
                    autoplay></lottie-player>
                </LottiePlayer>
              )
            )}
            {/* {nweetObj.emotion === "shocked" && (
                <ShockedMessage>
                  <iframe
                    src='https://giphy.com/embed/vQqeT3AYg8S5O'
                    width='300'
                    height='30'
                    frameBorder='0'
                    class='giphy-embed'
                    allowFullScreen></iframe>
                </ShockedMessage>
              )} */}
          </div>

          <div className='main_content'>
            <div className='feed_header'>
              <div className='user_info'>
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
              {/* <div className='addthis_inline_share_toolbox'></div> */}

              {/* <FacebookShareButton url={window.location}>hi</FacebookShareButton>
          <LineShareButton url={window.location}>line</LineShareButton>

          <TwitterShareButton></TwitterShareButton> */}
            </section>
          </div>
        </div>

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
