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

    res.send("ok");
  } catch (error) {
    next(error);
  }
});

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new userSchema(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(`you have been login`);
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
