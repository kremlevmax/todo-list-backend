const todoRouter = require("express").Router();
const Todo = require("../models/todo");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

todoRouter.get("/", async (request, response) => {
  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const todos = await Todo.find({ user: decodedToken.id });
  response.json(todos).end();
});

todoRouter.delete("/:id", async (request, response, next) => {
  const id = request.params.id;

  try {
    await Todo.findByIdAndRemove(id);
    response.status(200).end();
  } catch (error) {
    console.log(error);
  }
});

todoRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const todo = new Todo({
    content: body.content,
    status: false,
    user: user._id,
  });

  try {
    const savedTodo = await todo.save();
    user.todos.push(savedTodo._id);
    await user.save();
    response.status(201).json(savedTodo);
  } catch (exception) {
    console.log(exception);
  }
});

todoRouter.put("/:id", async (request, response, next) => {
  const body = request.body;
  const token = getTokenFrom(request);

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const todo = await Todo.findById(body.id);

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(body.id, {
      status: !todo.status,
    });
    response.status(201).json(updatedTodo);
  } catch (exception) {
    console.log(exception);
  }
});

todoRouter.post("/reset", async (request, response, next) => {
  await Todo.deleteMany({});
  response.status(200);
});

module.exports = todoRouter;
//1
