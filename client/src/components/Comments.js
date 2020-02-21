import React, { Component } from "react";
import { Comment } from "./Comment";
import TypeZone from "./TypeZone";
import "../css/Comments.css";

export default class Comments extends Component {
  constructor() {
    super();
    this.state = {
      commentsArr: [],
      commentToEdit: {
        text: "",
        authorName: ""
      },
      parentComment: {},
      editMode: false,
      replyMode: false,
      commentAmount: 0,
      isLoading: false
    };
  }

  formatDate = date => {
    let dd = date.getDate();
    dd = dd < 10 ? `0${dd}` : dd;

    let mm = date.getMonth() + 1;
    mm = mm < 10 ? `0${mm}` : mm;

    let yy = date.getFullYear();
    yy = yy < 10 ? `0${yy}` : yy;

    let hours = date.getHours();
    hours = hours < 10 ? `0${hours}` : hours;

    let minutes = date.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${dd}.${mm}.${yy} ${hours}:${minutes}`;
  };

  handleChange = e => {
    const { name, value } = e.target;

    let { commentToEdit } = this.state;

    commentToEdit[name] = value;

    this.setState({
      commentToEdit
    });
  };

  fetchData = () => {
    this.setState({ isLoading: true });
    fetch("/comments")
      .then(res => res.json())
      .then(data =>
        this.setState({
          commentsArr: data.commentsArray,
          commentAmount: data.amount,
          isLoading: false
        })
      );
  };

  componentDidMount = () => {
    this.fetchData();
  };

  deleteComment = async (comment, index) => {
    if (index === undefined) {
      fetch("/comments/delete", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comment)
      }).catch(error => console.error(error.message));
    } else {
      let arr = [];
      const { _id } = comment;
      arr.push({ _id });
      arr.push({ index });

      fetch("/comments/delete", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(arr)
      }).catch(error => console.error(error.message));
    }

    await this.fetchData();
  };

  updateComment = async (isSetState, comment) => {
    if (isSetState) {
      comment.state = !comment.state;
    } else {
      comment.edited = true;
    }

    await fetch("/comments/update", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(comment)
    });

    await this.disableModes();

    await this.fetchData();
  };

  enableEditMode = comment => {
    this.setState({ editMode: true, commentToEdit: { ...comment } });
  };

  enableReplyMode = comment => {
    this.setState({
      replyMode: true,
      commentToEdit: { text: "", authorName: "" },
      parentComment: comment
    });
  };

  disableModes = () => {
    this.setState({
      replyMode: false,
      editMode: false,
      commentToEdit: { text: "", authorName: "" },
      parentComment: {}
    });
  };

  addChildComment = async () => {
    const { commentToEdit, parentComment } = this.state;

    let newChildComment = { ...commentToEdit };

    newChildComment.state = false;
    newChildComment.creationTime = new Date();
    newChildComment.edited = false;

    const data = [];
    data.push({ ...newChildComment });
    data.push({ ...parentComment });

    await fetch("/comments/new", {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(data)
    }).catch(error => console.error(error.message));

    await this.disableModes();

    await this.fetchData();
  };

  render() {
    const {
      commentsArr,
      editMode,
      commentToEdit,
      commentAmount,
      isLoading,
      replyMode
    } = this.state;

    return (
      <div className="comments-section">
        <div className="header-wrapper">
          <div className="header-image" />
          <div className="header-item">Comments counter: {commentAmount}</div>
        </div>
        <div className="comments-wrapper">
          <div className={isLoading ? "loading-wrapper" : ""}>
            <div className={isLoading ? "loading" : "not-loading"}>
              Loading...
            </div>
          </div>

          {commentsArr.map((item, i) => {
            return (
              <div className="wrapper" key={i}>
                <Comment
                  formatDate={this.formatDate}
                  comment={item}
                  updateComment={this.updateComment}
                  enableEditMode={this.enableEditMode}
                  enableReplyMode={this.enableReplyMode}
                  deleteComment={this.deleteComment}
                />

                {item.childs.map((childComment, j) => {
                  const { _id } = childComment;
                  let childDate = new Date(childComment.creationTime);
                  return (
                    <div className="childComment-wrapper" key={_id}>
                      <div className="author-name">
                        {childComment.authorName}
                      </div>
                      <div className="text">{childComment.text}</div>
                      <div className="date">{this.formatDate(childDate)}</div>
                      <div className="comment-buttons">
                        <button onClick={() => this.deleteComment(item, j)}>
                          Delete
                        </button>
                      </div>

                      <div
                        className={
                          childComment.edited ? "edited" : "not-edited"
                        }
                      >
                        edited
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <TypeZone fetchData={this.fetchData} />
        <div
          className={
            editMode || replyMode ? "update-wrapper" : "update-disabled"
          }
        >
          <div className="update-comment">
            <input
              type="text"
              name="authorName"
              value={commentToEdit.authorName}
              onChange={this.handleChange}
              placeholder="Username"
            />

            <textarea
              name="text"
              value={commentToEdit.text}
              onChange={this.handleChange}
              placeholder="Write a message..."
            />

            <button
              onClick={() => {
                if (editMode) {
                  this.updateComment(false, commentToEdit);
                }
                this.addChildComment();
              }}
              className="btn-submit"
            >
              {editMode ? "Update message" : "Reply"}
            </button>
            <button onClick={this.disableModes} className="btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}
