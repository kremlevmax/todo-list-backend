const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const todosRouter = require("./controller/todos");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const middleware = require("./utils/middleware");

logger.info("connecting to", config.URL);

mongoose
  .connect(config.URL)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

app.use(express.static("build"));
app.use(cors());

app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/todos", todosRouter);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
