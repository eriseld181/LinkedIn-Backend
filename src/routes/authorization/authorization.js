const jwt = require("jsonwebtoken");
const userModel = require("../profile/schema");
const { verifyJWT } = require("./authentication");

const authorize = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    const decoded = await verifyJWT(token);

    const user = await userModel.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;

    next();
  } catch (e) {
    console.log(e);
    const error = new Error("Please authenticate!");
    error.httpStatusCode = 401;
    next(error);
  }
};
const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else {
    const error = new Error("You cannot perform this action, only Admin can!");
    error.httpStatusCode = 403;
    next(error);
  }
};

module.exports = { authorize, adminOnlyMiddleware };
