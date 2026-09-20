import pool from "../db/db.js";
import db from "../db/db.js";

export const createTodo = async (req, res) => {
  const { title, description, priority, due_date } = req.body;
  console.log(req.body);
  const userId = "ce4ff9af-1523-46b6-89e4-ecc45c1e1554";
  try {
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
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create todo" });
  }
};

export const getTodo = async (req, res) => {
  const todoId = req.params.id;
  if (!todoId) {
    return res.status(400).json({
      success: false,
      message: "Todo ID is required",
    });
  }

  try {
    const todo = await pool.query("SELECT * FROM todos WHERE id = $1", [
      todoId,
    ]);
    if (!todo.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: todo.rows[0],
      message: "Todo fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch todo",
    });
  }
};

export const getAllTodos = async (req, res) => {
  const userId = "ce4ff9af-1523-46b6-89e4-ecc45c1e1554";

  try {
    const todos = await pool.query("SELECT * FROM todos WHERE user_id = $1", [
      userId,
    ]);
    return res.status(200).json({
      success: true,
      data: todos.rows,
      message: "Todos fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch todos",
    });
  }
};
