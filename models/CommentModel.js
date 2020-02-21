const { Schema, model, Types } = require("mongoose");

const childComment = new Schema({
  state: { type: Boolean, required: true },
  authorName: {
    type: String,
    required: true,
    trim: true
  },
  text: { type: String, required: true },
  creationTime: { type: Date, required: true },
  edited: { type: Boolean, required: true }
});

const schema = new Schema({
  state: { type: Boolean, required: true },
  authorName: {
    type: String,
    required: true,
    trim: true
  },
  text: { type: String, required: true },
  creationTime: { type: Date, required: true },
  edited: { type: Boolean, required: true },
  childs: [childComment]
});

module.exports = model("Comment", schema);
