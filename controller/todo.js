const todoRouter = require("express").Router();
const Todo = require("../models/todo");

todoRouter.get("/", async (request, response) => {
  const todos = await Todo.find({});
  response.json(todos).end();
});

todoRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const todo = await Todo.findById(id);
  response.json(todo);
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

todoRouter.put("/:id", async (request, response) => {
  const id = request.params.id;

  try {
    const doneToDo = await Todo.findByIdAndUpdate(
      id,
      { status: request.body.status },
      {
        new: true,
      }
    );
    return response.json(doneToDo);
  } catch (error) {
    console.log(error);
  }
});

todoRouter.post("/", async (request, response, next) => {
  const todoData = request.body;
  const todo = new Todo({
    content: todoData.content,
    status: false,
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
