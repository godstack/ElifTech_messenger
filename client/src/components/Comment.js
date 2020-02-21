import React from "react";
import "../css/Comment.css";

export const Comment = props => {
  const { state, authorName, text, creationTime, edited } = props.comment;
  let date = new Date(creationTime);

  return (
    <div className="comment-wrapper">
      <div className="author-name">{authorName}</div>
      <div className="text">{text}</div>
      <div className="date">{props.formatDate(date)}</div>
      <div className="comment-buttons">
        <button onClick={() => props.deleteComment(props.comment)}>
          Delete
        </button>
        <button onClick={() => props.enableEditMode(props.comment)}>
          Update
        </button>

        <button onClick={() => props.enableReplyMode(props.comment)}>
          Reply
        </button>

        <div
          className={state ? "state-active" : "state-disabled"}
          onClick={() => props.updateComment(true, props.comment)}
        />
      </div>

      <div className={edited ? "edited" : "not-edited"}>edited</div>
    </div>
  );
};
