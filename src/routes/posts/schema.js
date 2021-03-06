const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const post = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "profiles",
      },
    ],
    image: {
      type: String,
      //put a default here
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
  },
  {
    timestamps: true,
  }
);
post.static("addProfile", async function (id) {
  const profile = await PostsModel.findOne({ _id: id }).populate(
    "user",
    "comments"
  );
  return profile;
});

module.exports = mongoose.model("posts", post);
