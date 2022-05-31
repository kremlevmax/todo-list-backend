const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("todos");

  response.json(users);
});

userRouter.post("/", async (request, response) => {
  const { email, name, password } = request.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return response.status(400).json({
      error: "username must be unique",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    email,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  console.log(savedUser);
  response.status(201).json(savedUser);
});

module.exports = userRouter;
