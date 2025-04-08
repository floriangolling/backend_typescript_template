import TodoService, { TodoServiceError, TodoServiceErrorType } from "@services/todo";
import HTTPError from "@type/type.error";
import { Request, Response } from "express";
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";
import { z } from "zod";

const ServiceErrorHTTP = {
  [TodoServiceErrorType.TODO_NOT_FOUND]: { status: 404, message: "Todo not found" },
  [TodoServiceErrorType.NOT_USER_TODO]: { status: 403, message: "Not user todo" },
};

@ApiPath({
  name: "Todos",
  path: "/api/todos",
})
class TodoController {
  // ----------------------------------------------------------------------------------

  static createTodoSchema = z.object({
    title: z.string().min(1, "title is required"),
    description: z.string().min(1, "description is required"),
  });

  @ApiOperationPost({
    description: "Create a todo",
    security: { bearerAuth: [] },
    parameters: {
      body: {
        properties: {
          title: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
          description: { type: SwaggerDefinitionConstant.Parameter.Type.STRING, required: true },
        },
      },
    },
    responses: {
      201: { type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "Todo" },
      400: { description: "Bad request" },
      500: { description: "Internal server error" },
    },
  })
  public async createTodo(req: Request, res: Response) {
    const title = req.body.title;
    const description = req.body.description;

    if (!title || !description) {
      throw new HTTPError("Bad request", 400);
    }

    const todo = await TodoService.createTodoForUser({ title, description }, req.user!.id);
    res.status(201).json(todo);
  }

  // ----------------------------------------------------------------------------------

  static updateTodoSchema = z.object({
    completed: z.boolean(),
    id: z.string().regex(/^\d+$/, "id must be a positive integer"),
  });

  @ApiOperationPut({
    path: "/{id}",
    parameters: {
      path: {
        id: {
          description: "Todo id",
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
      body: {
        properties: {
          completed: { type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN, required: true },
        },
      },
    },
    description: "Update a todo",
    security: { bearerAuth: [] },
    responses: {
      200: { type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: "Todo" },
      400: { description: "Bad request" },
      404: { description: "Todo not found" },
      500: { description: "Internal server error" },
    },
  })
  public async updateTodo(req: Request, res: Response) {
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

  // ----------------------------------------------------------------------------------

  static deleteTodoScheam = z.object({
    id: z.string().regex(/^\d+$/, "id must be a positive integer"),
  });

  @ApiOperationDelete({
    path: "/{id}",
    description: "Delete a todo",
    security: { bearerAuth: [] },
    parameters: {
      path: {
        id: {
          description: "Todo id",
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
      },
    },
    responses: {
      204: { description: "Todo deleted" },
      400: { description: "Bad request" },
      404: { description: "Todo not found" },
      500: { description: "Internal server error" },
    },
  })
  public async deleteTodo(req: Request, res: Response) {
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

  // ----------------------------------------------------------------------------------

  @ApiOperationGet({
    description: "Get user todos",
    security: { bearerAuth: [] },
    responses: {
      200: { type: SwaggerDefinitionConstant.Response.Type.ARRAY, model: "Todo" },
      403: { description: "Token missing" },
      404: { description: "User not found" },
      500: { description: "Internal server error" },
    },
  })
  public async getUserTodos(req: Request, res: Response) {
    const todos = await TodoService.getUserTodos(req.user!.id);
    res.json(todos);
  }
}

export default TodoController;
