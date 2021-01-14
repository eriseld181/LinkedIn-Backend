const { Schema } = require("mongoose");
const moongose = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ModelSchema = moongose.model("users", userSchema);
