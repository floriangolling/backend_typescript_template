import TodoService, { TodoServiceError, TodoServiceErrorType } from "@services/todo";
import HTTPError from "@type/type.error";
import { Request, Response } from "express";

const ServiceErrorHTTP = {
  [TodoServiceErrorType.TODO_NOT_FOUND]: { status: 404, message: "Todo not found" },
  [TodoServiceErrorType.NOT_USER_TODO]: { status: 403, message: "Not user todo" },
};

class TodoController {
  static async createTodo(req: Request, res: Response) {
    const title = req.body.title;
    const description = req.body.description;

    if (!title || !description) {
      throw new HTTPError("Bad request", 400);
    }

    const todo = await TodoService.createTodoForUser({ title, description }, req.user!.id);
    res.status(201).json(todo);
  }

  static async updateTodo(req: Request, res: Response) {
    const id = req.params.id;
    const completed = req.body.completed;

    if (typeof completed !== "boolean" || Number.isNaN(Number(id))) {
      throw new HTTPError("Bad request", 400);
    }

    try {
      const todo = await TodoService.updateTodo({ completed }, Number(id), req.user!.id);
      res.status(200).json(todo);
    } catch (err) {
      if (err instanceof TodoServiceError && ServiceErrorHTTP[err.reason]) {
        const { status, message } = ServiceErrorHTTP[err.reason];
        throw new HTTPError(message, status);
      }
      throw err;
    }
  }

  static async deleteTodo(req: Request, res: Response) {
    const id = req.params.id;

    if (Number.isNaN(Number(id))) {
      throw new HTTPError("Bad request", 400);
    }

    try {
      await TodoService.deleteTodoById(Number(id), req.user!.id);
      res.status(204).send();
    } catch (err) {
      if (err instanceof TodoServiceError && ServiceErrorHTTP[err.reason]) {
        const { status, message } = ServiceErrorHTTP[err.reason];
        throw new HTTPError(message, status);
      }
      throw err;
    }
  }

  static async getUserTodos(req: Request, res: Response) {
    const todos = await TodoService.getUserTodos(req.user!.id);
    res.json(todos);
  }
}

export default TodoController;
