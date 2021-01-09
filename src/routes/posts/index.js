const express = require("express");
const postSchema = require("./schema");
const multer = require("multer");
const upload = multer({});
const path = require("path");
const fs = require("fs-extra");

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
    next(error);
  }
});

userPosts.get("/:username", authorize, async (req, res, next) => {
  try {
    const myPosts = await postSchema.find(req.params.username).populate("user");
    res.send(myPosts);
  } catch (error) {
    next(error);
  }
});

userPosts.post("/", authorize, async (req, res, next) => {
  try {
    const newPost = new postSchema(req.body);
    await newPost.save();
    res.send("Post was published!");
  } catch (error) {
    next(error);
  }
});
userPosts.put("/:userId", authorize, async (req, res, next) => {
  try {
    const myPost = await postSchema.findByIdAndUpdate(
      { _id: req.params.userId },
      req.body
    );
    if (myPost) {
      res.send("Posts was edited succesfully!");
    } else {
      res.send("Post was not updated!");
    }
  } catch (error) {
    next(error);
  }
});
userPosts.delete("/:userId", authorize, async (req, res, next) => {
  try {
    const myPost = await postSchema.findByIdAndDelete({
      _id: req.params.userId,
    });
    if (myPost) {
      res.send("The post was succesully deleted!");
    } else {
      res.send("The post you are trying to delete, is no longer available");
    }
  } catch (error) {
    next(error);
  }
});

userPosts.post(
  "/uploadImage",
  authorize,
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (req.file) {
        const uploadImage = cloudinary.uploader.upload_stream(
          {
            folder: "linkedinProfile",
          },
          async (err, data) => {
            if (!err) {
              req.user.image = data.secure_url;
              await req.user.save({ validateBeforeSave: false });
              res.status(201).json(req.user.image);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadImage);
      } else {
        const error = new Error();
        error.httpStatusCode = 404;
        error.message = "image is missing";
        next(error);
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

module.exports = userPosts;
