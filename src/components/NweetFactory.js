import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService, dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faImage,
  faPlus,
  faTimes,
  faTrash,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import "./Upload.css";
import { useHistory } from "react-router";
import Picker from "emoji-picker-react";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const [emotion, setEmotion] = useState("happy");
  const history = useHistory();
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [choseEmoji, setEmoji] = useState(false);

  const onChangeEmotion = (event) => {
    setEmotion(event.target.value);
  };

  useEffect(() => {
    if (chosenEmoji !== null) {
      setNweet((nweet) => nweet + chosenEmoji?.emoji);
    }
  }, [chosenEmoji]);

  const onSubmit = async (event) => {
    if (nweet === "") {
      return;
    }
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
      username: userObj.displayName,
      emotion,
    };
    await dbService.collection(userObj.uid).add(nweetObj);
    setNweet("");
    setAttachment("");
    history.push("/");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
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

  const yourFeeling = () => {
    if (emotion === "happy") {
      return (
        <iframe
          src='https://giphy.com/embed/Lb4IZLmCfALhm'
          width='200'
          height='200'
          frameBorder='0'
          class='giphy-embed'></iframe>
      );
    } else if (emotion === "sad") {
      return (
        <iframe
          src='https://giphy.com/embed/OPU6wzx8JrHna'
          width='100%'
          height='200'
          frameBorder='0'
          class='giphy-embed'></iframe>
      );
    } else if (emotion === "angry") {
      return (
        <iframe
          src='https://giphy.com/embed/11tTNkNy1SdXGg'
          width='100%'
          height='200'
          frameBorder='0'
          class='giphy-embed'></iframe>
      );
    } else if (emotion === "soso") {
      return (
        <iframe
          src='https://giphy.com/embed/Ogq017TWp45JadcpIK'
          width='100%'
          height='200'
          frameBorder='0'
          class='giphy-embed'></iframe>
      );
    } else if (emotion === "funny") {
      return (
        <iframe
          src='https://giphy.com/embed/wW95fEq09hOI8'
          width='100%'
          height='200'
          frameBorder='0'
          class='giphy-embed'></iframe>
      );
    } else if (emotion === "shocked") {
      return (
        <iframe
          src='https://giphy.com/embed/5WXqTFTgO9a7e'
          width='100%'
          height='200'
          frameBorder='0'
          class='giphy-embed'></iframe>
      );
    }

    return <div></div>;
  };

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  return (
    <>
      <form onSubmit={onSubmit} className='column factoryForm'>
        <div className='column'>
          <div className='gif_player'>{yourFeeling()}</div>
          <div className='row yourFeeling'>
            <h1>I am </h1>
            <select value={emotion} onChange={onChangeEmotion}>
              <option value='happy'>happy</option>
              <option value='soso'>soso</option>
              <option value='funny'>funny</option>
              <option value='shocked'>shocked</option>
              <option value='sad'>sad</option>
              <option value='angry'>angry</option>
            </select>
          </div>
        </div>
        <div className='factoryInput__container'>
          <textarea
            className='factoryInput__input'
            value={nweet}
            onChange={onChange}
            type='text'
            placeholder="What's on your mind?"
            maxLength={120}
            autoFocus
          />
        </div>
        <input
          id='attach-file'
          type='file'
          accept='image/*'
          onChange={onFileChange}
          style={{
            display: "none",
          }}
        />
        <div className='row factory__actions'>
          {!attachment && (
            <label for='attach-file' className='factoryInput__label'>
              <FontAwesomeIcon
                icon={faImage}
                color='rgb(190, 190, 190)'
                className='svg_button'
              />
            </label>
          )}
          <span
            className='factoryInput__label'
            onClick={() => setEmoji(!choseEmoji)}>
            <FontAwesomeIcon
              icon={faSmile}
              color='rgb(190, 190, 190)'
              className='svg_button'
            />
          </span>
        </div>
        {choseEmoji && (
          <div className='emoji_container'>
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )}

        {attachment && (
          <div className='factoryForm__attachment'>
            <img
              src={attachment}
              style={{
                backgroundImage: attachment,
              }}
            />
            <div className='factoryForm__clear' onClick={onClearAttachment}>
              <FontAwesomeIcon icon={faTrash} />
            </div>
          </div>
        )}

        <button type='submit' className='factoryInput__arrow'>
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </form>
    </>
  );
};

export default NweetFactory;
