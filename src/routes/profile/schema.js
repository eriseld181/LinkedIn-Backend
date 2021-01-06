const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const myValidator = require("validator");

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
      lowercase: true,
      unique: true,
      validate: {
        validator: async (value) => {
          if (!myValidator.isEmail(value))
            throw new Error(
              "This email is already used or is invalid, please enter a valid email"
            );
        },
      },
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
profileSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};
profileSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Unable to login, please try again!");
    error.httpStatusCode = 401;
    throw error;
  }
  return user;
};
profileSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const UserModel = mongoose.model("profile", profileSchema);
module.exports = UserModel;
