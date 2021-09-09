import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { realtimeDatabase } from "../fbase";

const Comment = ({ userObj }) => {
  const [reply, setReply] = useState();
  const [newReply, setNewReply] = useState("");
  const { id } = useParams();

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
      .ref(`reply/${id}`)
      .update([...reply, newReplyObject]);
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
    <div>
      <form onSubmit={onReplySubmit}>
        <input type='text' value={newReply} onChange={onNewReplyChange} />
      </form>
      {reply &&
        reply.map((comment, index) => {
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
    </div>
  );
};

export default Comment;
