const express = require("express");
const expSchema = require("./expSchema");
const {
  authorize,
  adminOnlyMiddleware,
} = require("../authorization/authorization");

const expRouter = express.Router();
expRouter.get("/", authorize, async (req, res, next) => {
  try {
    const experiences = await expSchema.find(req.query);
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

expRouter.post("/", async (req, res, next) => {
  try {
    const newExp = new expSchema(req.body);
    const { _id } = await newExp.save();

    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

expRouter.put("/:id", async (req, res, next) => {
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

expRouter.delete("/:id", async (req, res, next) => {
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
