import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { realtimeDatabase } from "../fbase";
import "./Comment.css";

const Comment = ({ userObj }) => {
  const [reply, setReply] = useState();
  const [newReply, setNewReply] = useState("");
  const { id } = useParams();

  const onNewReplyChange = (event) => {
    setNewReply(event.target.value);
  };

  const onReplySubmit = async (event) => {
    event.preventDefault();
    if (!newReply) {
      return;
    }
    let newReplyObject = {
      id: reply.length,
      createdAt: Date.now(),
      reply: newReply,
      username: userObj.displayName,
      creatorId: userObj.uid,
    };
    await realtimeDatabase
      .ref(`reply/${id}`)
      .update([...reply, newReplyObject]);
    setNewReply("");
  };

  useEffect(async () => {
    await realtimeDatabase.ref(`reply/${id}`).on("value", (snap) => {
      let allReply = [];
      snap.forEach((value) => {
        allReply = [value.val(), ...allReply];
      });
      let sorted = allReply.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });
      setReply(sorted);
    });
  }, []);

  return (
    <article className='column' style={{ width: "100%" }}>
      <form onSubmit={onReplySubmit} className='column'>
        <input
          className='comment_input'
          type='text'
          placeholder='Write Comment!'
          value={newReply}
          onChange={onNewReplyChange}
        />
      </form>
      <section className='comments_container'>
        {reply &&
          reply.map((comment, index) => {
            return (
              <div
                className='comment'
                key={index}
                style={{
                  alignItems: comment.creatorId == userObj.uid && "flex-end",
                }}>
                <span className='username'>{comment.username}</span>
                <div className='message'>
                  <p>{comment.reply}</p>
                </div>
              </div>
            );
          })}
      </section>
    </article>
  );
};

export default Comment;
