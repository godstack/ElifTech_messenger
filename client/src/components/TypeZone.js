import React, { Component } from "react";

export default class TypeZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorName: "",
      text: "",
      state: false,
      edited: false
    };
  }

  handleChange = e => {
    const { value, name } = e.target;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    try {
      const { authorName, text, state, edited } = this.state;

      let newComment = {
        authorName,
        state,
        text,
        creationTime: new Date(),
        edited,
        childs: []
      };

      await fetch("/comments/new", {
        method: "post",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(newComment)
      }).then(data =>
        this.setState({
          authorName: "",
          text: ""
        })
      );
    } catch (e) {
      console.error(e.message);
    }

    this.props.fetchData();
  };

  render() {
    const { authorName, text } = this.state;

    return (
      <div className="typezone">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="authorName"
            value={authorName}
            onChange={this.handleChange}
            placeholder="Username"
          />

          <textarea
            name="text"
            value={text}
            onChange={this.handleChange}
            placeholder="Write a message..."
          />

          <button type="submit">Send message</button>
        </form>
      </div>
    );
  }
}
