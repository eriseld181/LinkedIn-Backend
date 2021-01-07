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
    const singelProfile = await userSchema.findById({ _id: id });
    if (singelProfile) {
      res.send(singelProfile);
    } else {
      res.send("Profile not exist");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

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
