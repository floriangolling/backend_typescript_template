import TodoService, { TodoServiceError, TodoServiceErrorType } from "@services/todo";
import HTTPError from "@type/type.error";
import { Request, Response } from "express";
import { z } from "zod";

const ServiceErrorHTTP = {
  [TodoServiceErrorType.TODO_NOT_FOUND]: { status: 404, message: "Todo not found" },
  [TodoServiceErrorType.NOT_USER_TODO]: { status: 403, message: "Not user todo" },
};

class TodoController {
  // ----------------------------------------------------------------------------------

  static createTodoSchema = z.object({
    title: z.string().min(1, "title is required"),
    description: z.string().min(1, "description is required"),
  });

  static async createTodo(req: Request, res: Response) {
    const title = req.body.title;
    const description = req.body.description;

    const schemaResult = TodoController.createTodoSchema.safeParse({ title, description });
    if (!schemaResult.success) {
      const errors = schemaResult.error.errors.map((error) => error.message);
      throw new HTTPError(errors.join(", "), 400);
    }

    const todo = await TodoService.createTodoForUser(schemaResult.data, req.user!.id);
    res.status(201).json(todo);
  }

  // ----------------------------------------------------------------------------------

  static updateTodoSchema = z.object({
    completed: z.boolean(),
    id: z.string().regex(/^\d+$/, "id must be a positive integer"),
  });

  static async updateTodo(req: Request, res: Response) {
    const id = req.params.id;
    const completed = req.body.completed;

    const schemaResult = TodoController.updateTodoSchema.safeParse({ completed, id });
    if (!schemaResult.success) {
      const errors = schemaResult.error.errors.map((error) => error.message);
      throw new HTTPError(errors.join(", "), 400);
    }

    try {
      const todo = await TodoService.updateTodo(
        { completed: schemaResult.data.completed },
        Number(schemaResult.data.id),
        req.user!.id,
      );
      res.status(200).json(todo);
    } catch (err) {
      if (err instanceof TodoServiceError && ServiceErrorHTTP[err.reason]) {
        const { status, message } = ServiceErrorHTTP[err.reason];
        throw new HTTPError(message, status);
      }
      throw err;
    }
  }

  // ----------------------------------------------------------------------------------

  static deleteTodoScheam = z.object({
    id: z.string().regex(/^\d+$/, "id must be a positive integer"),
  });

  static async deleteTodo(req: Request, res: Response) {
    const id = req.params.id;

    const schemaResult = TodoController.deleteTodoScheam.safeParse({ id });
    if (!schemaResult.success) {
      const errors = schemaResult.error.errors.map((error) => error.message);
      throw new HTTPError(errors.join(", "), 400);
    }

    try {
      await TodoService.deleteTodoById(Number(schemaResult.data.id), req.user!.id);
      res.status(204).send();
    } catch (err) {
      if (err instanceof TodoServiceError && ServiceErrorHTTP[err.reason]) {
        const { status, message } = ServiceErrorHTTP[err.reason];
        throw new HTTPError(message, status);
      }
      throw err;
    }
  }

  // ----------------------------------------------------------------------------------

  static async getUserTodos(req: Request, res: Response) {
    const todos = await TodoService.getUserTodos(req.user!.id);
    res.json(todos);
  }
}

export default TodoController;
