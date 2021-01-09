const express = require("express");
const comentsSchema = require("./schema");
const { authorize } = require("../authorization/authorization");
const comentRoute = express.Router();
const postSchema = require("../posts/schema");

comentsSchema.get("/:_id", authorize, async (req, res, next) => {
  try {
    const data = await comentsSchema.findById({ _id: req.params._id });
    if (data) {
      res.send(data);
    } else {
      res.send("This comment does not exist");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

comentRoute.post("/addComent/:_id", authorize, async (req, res, next) => {
  try {
    const newComment = new comentsSchema(req.body);
    newComment.name = req.user.name;
    newComment.name = req.user.surname;
    newComment.name = req.user.username;
    newComment.name = req.user.image;
    const data = await newComment.save();
    const post = await postSchema.findById({ _id: req.params._id });
    post.comments.push(data._id);
    await post.save();
    if (data) {
      res.send(data);
    } else {
      res.send("please inpu data");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

comentRoute.put("/editComment/:_id", authorize, async (req, res, next) => {
  try {
    const data = await comentsSchema.findByIdAndUpdate(
      { _id: req.params._id },
      req.body
    );
    if (data) {
      res.send(data);
    } else {
      res.send("Bad data entry");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

comentRoute.delete(
  "/:postId/delete/:_id",
  authorize,
  async (req, res, next) => {
    try {
      const deleteComment = await comentsSchema.findByIdAndDelete({
        _id: req.params._id,
      });
      const removeId = await postSchema.find({ _id: req.params.postId });
      const data = removeId.comments.filter((x) => x !== req.params._id);
      removeId.comments = [data];

      const newComments = await removeId.save();
      if (newComments) {
        req.send("comment was deleted");
      } else {
        res.send("comment doesn't exits");
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

module.exports = comentRoute;
