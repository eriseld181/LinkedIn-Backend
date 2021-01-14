const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const port = process.env.PORT;
const userProfile = require("./routes/profile");
const userPosts = require("./routes/posts");
const server = express();
const expRouter = require("./routes/experiences");
const comments = require("./routes/comments");
const socket = require("./routes/chat/util/utils");
const http = require("http");
const app = http.createServer(server);
const {
  badRequestHandler,
  unauthorizedRequestHandler,
  forbiddenRequestHandler,
  notFoundRequestHandler,
  internalServerErrorRequestHandler,
  badGatewayRequestHandler,
  serviceUnavailableRequestHandler,
  gatewayTimeoutRequestHandler,
} = require("./errorHandlers");
socket(app);
server.use(express.json());
server.use(cookieParser());
server.use(cors());
server.use("/profile", userProfile);
server.use("/exp", expRouter);
server.use("/posts", userPosts);
server.use("/comments", comments);
//ERROR HANDLERS
server.use(badRequestHandler);
server.use(unauthorizedRequestHandler);
server.use(forbiddenRequestHandler);
server.use(notFoundRequestHandler);
server.use(internalServerErrorRequestHandler);
server.use(badGatewayRequestHandler);
server.use(serviceUnavailableRequestHandler);
server.use(gatewayTimeoutRequestHandler);

//connecting server with mongodb
mongoose
  .connect(process.env.MongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //I put this line to remove the warning, if it cause any problem, we should remove that.
    useCreateIndex: true,
  })
  .then(
    server.listen(port || 3009, () => {
      console.log("Server is running on port", port || 3009);
    })
  )
  .catch((err) => console.log(err));
