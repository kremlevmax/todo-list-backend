const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const todoRouter = require("./controller/todo");
const userRouter = require("./controller/user");
const loginRouter = require("./controller/login");

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
app.use("/api/todos", todoRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
