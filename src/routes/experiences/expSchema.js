const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const exSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },

    username: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Experiences", exSchema);
