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
  } catch (err) {
    next(err);
  }
});

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(`you have been login`);
  } catch (err) {
    next(err);
  }
});
