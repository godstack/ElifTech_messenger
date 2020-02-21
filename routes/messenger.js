const { Router } = require("express");
const router = Router();
const Comment = require("../models/CommentModel");
const { check, validationResult } = require("express-validator");

router.post("/comments/new", async (req, res) => {
  if (!req.body[0]) {
    const comment = new Comment({
      ...req.body
    });

    comment
      .save()
      .then(() => res.json("Comment added!"))
      .catch(err => res.status(400).json("Error: " + err.message));
  } else {
    const childComment = {
      ...req.body[0]
    };

    const parentComment = {
      ...req.body[1]
    };

    const { _id } = parentComment;

    Comment.findById(_id)
      .then(comment => {
        comment.childs.push(childComment);
        comment.save();
      })
      .then(() => res.json("Child comment added!"))
      .catch(err => res.status(400).json("Error: " + err));
  }
});

//End this route
router.post("/comments/update", (req, res) => {
  if (!req.body[0]) {
    const comment = {
      ...req.body
    };

    const { _id } = comment;

    Comment.findById(_id)
      .then(findedComment => {
        findedComment.state = comment.state;
        findedComment.authorName = comment.authorName;
        findedComment.text = comment.text;
        findedComment.creationTime = comment.creationTime;
        findedComment.childs = comment.childs;
        findedComment.edited = comment.edited;

        findedComment
          .save()
          .then(() => res.json("Comment updated!"))
          .catch(err => res.status(400).json("Error: " + err));
      })
      .catch(err => res.status(400).json("Error: " + err));
  } else {
    const commentId = req.body[0]._id;

    const index = req.body[1].index;

    Comment.findById(commentId)
      .then(comment => {
        comment.childs[index] = !comment.childs[index];
        comment.save();
      })
      .catch(err => res.status(400).json("Error: " + err));
  }
});

//End this route
router.post("/comments/delete", (req, res) => {
  if (!req.body[0]) {
    const comment = {
      ...req.body
    };

    const { _id } = comment;

    Comment.findByIdAndDelete(_id)
      .then(() => res.json("Comment deleted"))
      .catch(err => res.status(400).json("Error: " + err));
  } else {
    const commentId = req.body[0]._id;

    const index = req.body[1].index;

    Comment.findById(commentId)
      .then(comment => {
        comment.childs.splice(index, 1);

        comment.save();
      })
      .catch(err => res.status(400).json("Error: " + err));
  }
});

router.get("/comments", async (req, res) => {
  const commentsArray = await Comment.find({}).catch(error =>
    console.log(
      `Unable to retrieve data from database, error: ${error.message}`
    )
  );

  const amount = await Comment.countDocuments({}).catch(error =>
    console.log(
      `Unable to retrieve data from database, error: ${error.message}`
    )
  );

  const responce = { commentsArray, amount };

  res.json(responce);
});

module.exports = router;
