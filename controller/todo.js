const todoRouter = require("express").Router();
const Todo = require("../models/todo");
const User = require("../models/user");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

todoRouter.get("/", async (request, response) => {
  const todos = await Todo.find({});
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
    content: todoData.content,
    status: false,
    user: user._id,
  });

  try {
    const savedTodo = await todo.save();
    response.status(201).json(savedTodo);
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
