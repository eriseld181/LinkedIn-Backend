const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const profileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    username: {
      type: String,
    },
    refreshTokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("profile", profileSchema);
module.exports = UserModel;

// {
//     "_id": "5d84937322b7b54d848eb41b", //server generated
//     "name": "Diego",
//     "surname": "Banovaz",
//     "email": "diego@strive.school",
//     "bio": "SW ENG",
//     "title": "COO @ Strive School",
//     "area": "Berlin",
//     "image": ..., //server generated on upload, set a default here
//     "username": "admin",
//     "createdAt": "2019-09-20T08:53:07.094Z", //server generated
//     "updatedAt": "2019-09-20T09:00:46.977Z", //server generated
// }
