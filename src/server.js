const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const port = process.env.PORT;
const userProfile = require("./routes/profile");
const server = express();
const expRouter = require("./routes/experiences");

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
server.use("/profile", userProfile);
server.use("/exp", expRouter);
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
