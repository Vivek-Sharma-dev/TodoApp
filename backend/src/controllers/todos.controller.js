import config from "../config/config.js";
import pool from "../db/db.js";
import { transporter } from "../services/email.service.js";
import AppError from "../utils/AppError.js";

export const createTodo = async (req, res) => {
  const { title, description, priority, due_date } = req.body;
  const userId = req.user.id;
  if (new Date(due_date) < new Date()) {
    throw new AppError("Due date cannot be in the past", 400);
  }
  const insertQuery =
    "INSERT INTO todos (user_id, title, description, priority, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const result = await pool.query(insertQuery, [
    userId,
    title,
    description,
    priority,
    due_date,
  ]);
  return res.status(201).json({
    success: true,
    data: result.rows[0],
    message: "Todo created successfully",
  });
};

export const getTodo = async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user.id;
  const todo = await pool.query(
    "SELECT * FROM todos WHERE id = $1 AND user_id = $2",
    [todoId, userId],
  );
  if (!todo.rows[0]) {
    throw new AppError("Todo not found", 404);
  }
  return res.status(200).json({
    success: true,
    data: todo.rows[0],
    message: "Todo fetched successfully",
  });
};

export const getAllTodos = async (req, res) => {
  const userId = req.user.id;
  const status = req.query?.status?.toLowerCase();

  let todos;
  let message;

  if (status) {
    if (status === "completed") {
      todos = await pool.query(
        "SELECT * FROM todos WHERE user_id = $1 AND completed = $2",
        [userId, true],
      );
      message = `Fetch all Completed Todos`;
    } else if (status === "pending") {
      todos = await pool.query(
        "SELECT * FROM todos WHERE user_id = $1 AND completed = $2",
        [userId, false],
      );
      message = `Fetch all Pending Todos`;
    } else if (status === "today") {
      todos = await pool.query(
        "SELECT * FROM todos WHERE user_id = $1 AND due_date >= CURRENT_DATE AND due_date < CURRENT_DATE + INTERVAL '1 day' ",
        [userId],
      );
      message = `Fetch all today task`;
    } else if (status === "upcoming") {
      todos = await pool.query(
        "SELECT * FROM todos WHERE user_id = $1 AND due_date > CURRENT_DATE + INTERVAL '1 day' ",
        [userId],
      );
      message = `Fetch upcoming todos`;
    } else if (status === "overdue") {
      todos = await pool.query(
        "SELECT * FROM todos WHERE user_id = $1 AND due_date < CURRENT_DATE AND completed = $2 ",
        [userId, false],
      );
      message = `Fetch incomplete todo which are overdue as well`;
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values are 'pending' and 'completed'.",
      });
    }
  } else {
    todos = await pool.query("SELECT * FROM todos WHERE user_id = $1", [
      userId,
    ]);
    message = `Fetch all todos data`;
  }

  return res.status(200).json({
    success: true,
    data: todos.rows,
    meta: {
      totalTodos: todos.rows.length,
    },
    message: message,
  });
};

export const updateTodo = async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user.id;
  if (req.body.due_date && new Date(req.body.due_date) < new Date()) {
    throw new AppError("Due date cannot be in the past", 400);
  }
  let fields = [];
  let values = [];
  const allowedFields = [
    "title",
    "description",
    "completed",
    "due_date",
    "priority",
  ];
  for (const field of allowedFields) {
    if (Object.hasOwn(req.body, field)) {
      fields.push(field);
      values.push(req.body[field]);
    }
  }

  fields.push("updated_at");
  values.push(new Date());
  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");
  const query = `UPDATE todos SET ${setClause} WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2} RETURNING *`;
  const result = await pool.query(query, [...values, todoId, userId]);
  if (!result.rows[0]) {
    throw new AppError("Todo not found", 404);
  }
  return res.status(200).json({
    success: true,
    data: result.rows[0],
    message: "Todo updated successfully",
  });
};

export const deleteTodo = async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user.id;
  const result = await pool.query(
    "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
    [todoId, userId],
  );
  if (!result.rows[0]) {
    throw new AppError("Todo not found", 404);
  }
  return res.status(200).json({
    success: true,
    data: result.rows[0],
    message: "Todo deleted successfully",
  });
};
