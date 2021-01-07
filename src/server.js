const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const port = process.env.PORT;
const userProfile = require("./routes/profile");
const server = express();
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

server.use(express.json());
server.use(cookieParser());
server.use(cors());

server.use(badRequestHandler);
server.use(unauthorizedRequestHandler);
server.use(forbiddenRequestHandler);
server.use(notFoundRequestHandler);
server.use(internalServerErrorRequestHandler);
server.use(badGatewayRequestHandler);
server.use(serviceUnavailableRequestHandler);
server.use(gatewayTimeoutRequestHandler);

server.use("/profile", userProfile);

//connecting server with mongodb
mongoose
  .connect(process.env.MongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port || 3009, () => {
      console.log("Server is running on port", port || 3009);
    })
  )
  .catch((err) => console.log(err));
