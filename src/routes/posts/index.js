const express = require("express");
const mongo = require("./schema");
const path = require("path");
const fs = require("fs-extra");
const multer = require("multer");
const upload = multer();
const q2m = require("query-to-mongo");
const posts = express.Router();
const imagePath = path.join(__dirname, "../../../public/image/post");

posts.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const posts = await mongo
      .find(query.criteria, query.options.fields)
      .populate("user")
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);
    res.send(posts);
  } catch (err) {
    next(err);
  }
});
posts.get("/:username", async (req, res, next) => {
  try {
    const posts = await mongo.findById(req.params.username).populate("user");
    res.send(posts);
  } catch (err) {
    next(err);
  }
});
posts.post("/", async (req, res, next) => {
  try {
    const newPost = new mongo(req.body);
    await newPost.save();
    res.send("Added");
  } catch (err) {
    next(err);
  }
});

posts.put("/:username", async (req, res, next) => {
  try {
    const posts = await mongo.findByIdAndUpdate(req.params.username, req.body);
    res.send("ok");
  } catch (err) {
    next(err);
  }
});

posts.delete("/:username", async (req, res, next) => {
  try {
    const post = await mongo.findByIdAndDelete(req.params.username);
    if (post) {
      res.send("Deleted");
    } else {
      res.send("Not exist in database");
    }
  } catch (err) {
    next(err);
  }
});
posts.post("/:postId/image", upload.single("image"), async (req, res, next) => {
  try {
    await fs.writeFile(
      path.join(imagePath, `${req.params.postId}.jpg`),
      req.file.buffer
    );

    req.body = {
      image: `https://linkedin-team.herokuapp.com/image/post/${req.params.postId}.jpg`,
    };
    console.log(req.body);
    const image = await mongo.findByIdAndUpdate(
      { _id: req.params.postId },
      req.body
    );
    console.log(image);
    if (image) {
      res.send("Image Added");
    } else {
      res.send("Not exist");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = posts;
