const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT;
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
console.log(process.env.REFRESH_JWT_SECRET);
server.use(express.json());
server.use(cors());
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
  })
  .then(
    server.listen(port || 3009, () => {
      console.log("Server is running on port", port || 3009);
    })
  )
  .catch((err) => console.log(err));
