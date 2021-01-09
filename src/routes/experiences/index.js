const express = require("express");
const expSchema = require("./expSchema");
const profileSchema = require("../profile/schema");
const {
  authorize,
  adminOnlyMiddleware,
} = require("../authorization/authorization");
const multer = require("multer");
const upload = multer({});
const expRouter = express.Router();
expRouter.get("/", authorize, async (req, res, next) => {
  try {
    const experiences = await expSchema.find({ username: req.user.username });
    res.send(experiences);
  } catch (error) {
    next(error);
  }
});

expRouter.get("/:id", authorize, async (req, res, next) => {
  try {
    const id = req.params.id;
    const experiences = await expSchema.findById(id);

    if (experiences) {
      res.send(experiences);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    console.log(error);
    next("While reading experiences list a problem occurred!");
  }
});

expRouter.post(
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

expRouter.post("/", authorize, async (req, res, next) => {
  try {
    const newExp = new expSchema(...req.body);
    newExp.username = req.user.username;
    const { _id } = await newExp.save();

    await profile.save({ validateBeforeSave: false });

    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

expRouter.put("/:id", authorize, async (req, res, next) => {
  try {
    const experiences = await expSchema.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (experiences) {
      res.send("Ok");
    } else {
      const error = new Error(`experiences with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

expRouter.delete("/:id", authorize, async (req, res, next) => {
  try {
    const experiences = await expSchema.findByIdAndDelete(req.params.id);
    if (experiences) {
      res.send("Deleted");
    } else {
      const error = new Error(`experiences with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});
module.exports = expRouter;
