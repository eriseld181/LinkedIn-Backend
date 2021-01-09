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
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const experiences = require("../experiences/expSchema");
const pdfCreate = require("pdfkit");
const axios = require("axios");
const upload = multer({});

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

userRouter.get("/allProfiles", authorize, async (req, res, next) => {
  try {
    const allProfiles = await userSchema.find();
    if (allProfiles) {
      res.send(allProfiles);
    } else {
      res.send("no profiles are in");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userRouter.get("/profile/:_id", authorize, async (req, res, next) => {
  try {
    const id = req.params._id;
    const singleProfile = await userSchema.findById({ _id: id });
    if (singleProfile) {
      res.send(singleProfile);
    } else {
      res.send("Profile not exist");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userRouter.get("/:_id/pdf", authorize, async (req, res, next) => {
  try {
    const user = await userSchema.findById({ _id: req.params._id });
    const experienc = await experiences.find({ username: user.username });
    const doc = new pdfCreate();
    const url = user.image;
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${user.name}.pdf`
    );
    if (url.length > 0) {
      const imageProfile = await axios.get(url, {
        responseType: "arraybuffer",
      });
      const image = new Buffer(imageProfile.data, "base64");
      doc.image(image, 100, 50, {
        fit: [100, 100],
      });
    }
    doc.font("Helventica-Bold");
    doc.fontSize(20);

    doc.text(`${profile.name} ${profile.surname}`, 100, 140, {
      width: 410,
      align: "center",
    });
    doc.fontSize(12);
    doc.font("Helvetica");
    doc.text(
      `
  ${profile.title}
  ${profile.area}
  ${profile.email}`,
      360,
      180,
      {
        align: "left",
      }
    );
    doc.fontSize(18);
    doc.text("Experiences", 100, 270, {
      width: 410,
      align: "center",
    });
    doc.fontSize(12);
    const start = async () => {
      experienc.forEach(
        async (exp) =>
          doc.text(`
        Role: ${exp.role}
        Company: ${exp.company}
        Starting Date: ${exp.startDate.toString().slice(4, 15)}
        Description: ${exp.description}
        Area:  ${exp.area}
        -------------------------------------------------------
      `),
        {
          width: 410,
          align: "center",
        }
      );
    };
    await start();

    let grad = doc.linearGradient(50, 0, 350, 100);
    grad.stop(0, "#0077B5").stop(1, "#004451");

    doc.rect(0, 0, 70, 1000);
    doc.fill(grad);

    doc.pipe(res);

    doc.end();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userRouter.post(
  "/uploadImage",
  authorize,
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (req.file) {
        const uploadImage = cloudinary.uploader.upload_stream(
          {
            folder: "linkedinProfile",
          },
          async (err, data) => {
            if (!err) {
              req.user.image = data.secure_url;
              await req.user.save({ validateBeforeSave: false });
              res.status(201).json(req.user.image);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadImage);
      } else {
        const error = new Error();
        error.httpStatusCode = 404;
        error.message = "image is missing";
        next(error);
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

userRouter.put("/editProfile", authorize, async (req, res, next) => {
  try {
    const update = req.body;
    const id = req.user._id;
    const updateProfile = await userSchema.findByIdAndUpdate(
      { _id: id },
      { validateBeforeSave: false },
      update
    );
    if (updateProfile) {
      res.send("Profile Updated");
    } else {
      res.send("Not Updated");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userRouter.delete("deleteAccount", authorize, async (req, res, next) => {
  try {
    const id = req.user._id;
    const deleteAccount = await userSchema.findByIdAndDelete({ _id: id });
    if (deleteAccount) {
      res.send("account deleted");
    } else {
      res.send("account not exist");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

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

    res.send("you have beeen login");
  } catch (error) {
    next(error);
  }
});

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new userSchema(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(`you have been reggister`);
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
