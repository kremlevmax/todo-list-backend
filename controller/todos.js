const todosRouter = require("express").Router();
const Todo = require("../models/todo");

todosRouter.get("/", async (request, response) => {
  const todos = await Todo.find({});
  response.json(todos);
});

todosRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const todo = await Todo.findById(id);
  response.json(todo);
});

todosRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  console.log("doneToDo");

  try {
    const doneToDo = await Todo.findByIdAndUpdate(
      id,
      { status: request.body.status },
      {
        new: true,
      }
    );
    console.log(doneToDo);
    return response.json(doneToDo);
  } catch (error) {
    console.log(error);
  }
});

todosRouter.post("/", async (request, response, next) => {
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

todosRouter.post("/reset", async (request, response, next) => {
  await Todo.deleteMany({});
  response.status(200);
});

module.exports = todosRouter;
//1
