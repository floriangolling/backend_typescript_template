import TodoController from "@controllers/todos";
import { Router } from "express";

const TodoControllerInstance = new TodoController();
const TodoRouter = Router();

// ----------------------------------------------------------------------------------

TodoRouter.get("/", TodoControllerInstance.getUserTodos);

// ----------------------------------------------------------------------------------

TodoRouter.post("/", TodoControllerInstance.createTodo);

// ----------------------------------------------------------------------------------

TodoRouter.put("/:id", TodoControllerInstance.updateTodo);

// ----------------------------------------------------------------------------------

TodoRouter.delete("/:id", TodoControllerInstance.deleteTodo);

export default TodoRouter;
