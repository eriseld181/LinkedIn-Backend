const express = require("express");
const postSchema = require("./schema");
const path = require("path");
const fs = require("fs-extra");
const multer = require("multer");
const upload = multer();
const q2m = require("query-to-mongo");
const userPosts = express.Router();
const imagePath = path.join(__dirname, "../../../public/image/post");
const {
  authorize,
  adminOnlyMiddleware,
} = require("../authorization/authorization");

userPosts.get("/", authorize, async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const myPosts = await postSchema
      .find(query.criteria, query.options.fields)
      .populate("user")
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);
    res.send(posts);
  } catch (error) {
    next(err);
  }
});

userPosts.get("/:username", authorize, async (req, res, next) => {
  try {
    const myPosts = await postSchema.find(req.params.username).populate("user");
    res.send(myPosts);
  } catch (error) {
    next(err);
  }
});

userPosts.post("/", authorize, async (req, res, next) => {
  try {
    const newPost = new postSchema(req.body);
    await newPost.save();
    res.send("Post was published!");
  } catch (error) {
    next(err);
  }
});

module.exports = userPosts;
