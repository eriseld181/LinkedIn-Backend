const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const messageSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
});

const ModelSchema = mongoose.model("message", messageSchema);
module.exports = ModelSchema;
