const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const exSchema = new Schema(
  {
    text: {
      type: String,
    },
    reaction: {
      type: String,
    },
    username: {
      type: String,
    },
    userImage: {
      type: String,
    },
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("comments", exSchema);
