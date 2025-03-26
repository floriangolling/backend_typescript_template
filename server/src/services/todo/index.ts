import { TodoModel } from "@database/models";
import BaseService from "@services/baseService";

export enum TodoServiceErrorType {
  TODO_NOT_FOUND,
  NOT_USER_TODO,
}

export class TodoServiceError extends Error {
  public reason: TodoServiceErrorType;

  constructor(reason: TodoServiceErrorType) {
    super(`todoservice_reason_${reason}`);
    this.reason = reason;
  }
}

class TodoService extends BaseService<TodoModel> {
  constructor() {
    super(TodoModel);
  }

  async getUserTodos(userId: number, completed: boolean = false) {
    return this.findAll({ where: { userId, completed } });
  }

  async createTodoForUser(data: Pick<TodoModel, "title" | "description">, userId: number) {
    return this.create({ ...data, userId });
  }

  async updateTodo(data: Pick<TodoModel, "completed">, id: number, userId: number) {
    const todo = await this.findById(id);
    if (!todo) {
      throw new TodoServiceError(TodoServiceErrorType.TODO_NOT_FOUND);
    }
    if (todo.userId !== userId) {
      throw new TodoServiceError(TodoServiceErrorType.NOT_USER_TODO);
    }
    todo.set(data);
    return todo.save();
  }

  async deleteTodoById(id: number, userId: number) {
    const todo = await this.findById(id);
    if (!todo) {
      throw new TodoServiceError(TodoServiceErrorType.TODO_NOT_FOUND);
    }
    if (todo.userId !== userId) {
      throw new TodoServiceError(TodoServiceErrorType.NOT_USER_TODO);
    }
    return this.delete({ id });
  }
}

export default new TodoService();
