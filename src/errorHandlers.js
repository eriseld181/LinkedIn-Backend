const badRequestHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 400) {
    res.status(400).send(err.message || "Bad Request, Try again!");
  }
  next(err);
};
const unauthorizedRequestHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 401) {
    res.status(401).send(err.message || "Unauthorized, please try again!");
  }
  next(err);
};
const forbiddenRequestHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 403) {
    res.status(403).send(err.message || "Forbidden, please ask admin help!");
  }
  next(err);
};
const notFoundRequestHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    res
      .status(404)
      .send(err.message || "Not Found, please try something else!");
  }
  next(err);
};
const internalServerErrorRequestHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 500) {
    res
      .status(500)
      .send(err.message || "Internal Server Error, please try again later!");
  }
  next(err);
};

const badGatewayRequestHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 502) {
    res.status(502).send(err.message || "Bad Gateway, please try again later!");
  }
  next(err);
};
const serviceUnavailableRequestHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 503) {
    res
      .status(503)
      .send(err.message || "Service Unavailable, please check again!");
  }
  next(err);
};
const gatewayTimeoutRequestHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 504) {
    res
      .status(504)
      .send(err.message || "Gateway Timeout, please try again later!");
  }
  next(err);
};

module.exports = {
  badRequestHandler,
  unauthorizedRequestHandler,
  forbiddenRequestHandler,
  notFoundRequestHandler,
  internalServerErrorRequestHandler,
  badGatewayRequestHandler,
  serviceUnavailableRequestHandler,
  gatewayTimeoutRequestHandler,
};
