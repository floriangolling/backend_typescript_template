import TodoController from "@controllers/todos";
import { Router } from "express";

const TodoRouter = Router();

// ----------------------------------------------------------------------------------

/**
 * @route GET /api/todos
 * @group Todos
 * @returns {Array.<Todo>} 200 - List of user todos
 * @returns {Error} 403 - Token missing
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Internal server error
 * @security JWT
 */
TodoRouter.get("/", TodoController.getUserTodos);

// ----------------------------------------------------------------------------------

/**
 * @route POST /api/todos
 * @group Todos
 * @param {string} title.body.required - Todo title
 * @returns {object} 201 - Created todo
 * @returns {Error} 400 - Bad request
 * @returns {Error} 500 - Internal server error
 * @security JWT
 */
TodoRouter.post("/", TodoController.createTodo);

// ----------------------------------------------------------------------------------

/**
 * @route PUT /api/todos/{id}
 * @group Todos
 * @param {number} id.path.required - Todo id
 * @param {boolean} completed.body.required - Todo completed status
 * @returns {object} 200 - Updated todo
 * @returns {Error} 400 - Bad request
 * @returns {Error} 404 - Todo not found
 * @returns {Error} 500 - Internal server error
 * @security JWT
 */
TodoRouter.put("/:id", TodoController.updateTodo);

// ----------------------------------------------------------------------------------

/**
 * @route DELETE /api/todos/{id}
 * @group Todos
 * @param {number} id.path.required - Todo id
 * @returns {object} 204 - Todo deleted
 * @returns {Error} 400 - Bad request
 * @returns {Error} 404 - Todo not found
 * @returns {Error} 500 - Internal server error
 * @security JWT
 */
TodoRouter.delete("/:id", TodoController.deleteTodo);

// ----------------------------------------------------------------------------------

export default TodoRouter;
