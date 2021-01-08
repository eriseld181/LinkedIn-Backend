const express = require("express");
const userSchema = require("./schema");
const userRouter = express.Router();
const {
  authenticate,
  refreshToken1,
} = require("../authorization/authentication");
const {
  authorize,
  adminOnlyMiddleware,
} = require("../authorization/authorization");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const upload = multer({});

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

userRouter.get("/allProfiles", authorize, async (req, res, next) => {
  try {
    const allProfiles = await userSchema.find();
    if (allProfiles) {
      res.send(allProfiles);
    } else {
      res.send("no profiles are in");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userRouter.get("/profile/:_id", authorize, async (req, res, next) => {
  try {
    const id = req.params._id;
    const singleProfile = await userSchema.findById({ _id: id });
    if (singleProfile) {
      res.send(singleProfile);
    } else {
      res.send("Profile not exist");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userRouter.post(
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

userRouter.put("/editProfile", authorize, async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.user._id;
    const updateProfile = await userSchema.findByIdAndUpdate(
      { _id: id },
      { validateBeforeSave: false },
      update
    );
    if (updateProfile) {
      res.send("Profile Updated");
    } else {
      res.send("Not Updated");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userRouter.delete("deleteAccount", authorize, async (req, res, next) => {
  try {
    const id = req.user._id;
    const deleteAccount = await userSchema.findByIdAndDelete({ _id: id });
    if (deleteAccount) {
      res.send("account deleted");
    } else {
      res.send("account not exist");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findByCredentials(email, password);
    const token = await authenticate(user);
    res.cookie("accessToken", token.token, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/refreshToken",
      sameSite: "none",
    });

    res.send("you have beeen login");
  } catch (error) {
    next(error);
  }
});

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new userSchema(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(`you have been reggister`);
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
