import pool from "../db/db.js";

export const createTodo = async (req, res) => {
  const { title, description, priority, due_date } = req.body;
  const userId = req.user.id;
  try {
    if (new Date(due_date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Due date cannot be in the past",
      });
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
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create todo" });
  }
};

export const getTodo = async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user.id;
  try {
    const todo = await pool.query(
      "SELECT * FROM todos WHERE id = $1 AND user_id = $2",
      [todoId, userId],
    );
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
  const userId = req.user.id;

  try {
    const todos = await pool.query("SELECT * FROM todos WHERE user_id = $1", [
      userId,
    ]);

    if (!todos.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Todos not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: todos.rows,
      message: "Todos fetched successfully",
      totalTodos: todos.rows.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch todos",
    });
  }
};

export const updateTodo = async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user.id;
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
  if (fields.due_date && new Date(fields.due_date) < new Date()) {
    return res.status(400).json({
      success: false,
      message: "Due date cannot be in the past",
    });
  }
  fields.push("updated_at");
  values.push(new Date());
  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");
  const query = `UPDATE todos SET ${setClause} WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2} RETURNING *`;
  try {
    const result = await pool.query(query, [...values, todoId, userId]);
    console.log('result is: ', result.rows[0]);
    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: "Todo updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Failed to update todo",
    });
  }
};

export const deleteTodo = async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user.id;
  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
      [todoId, userId],
    );
    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete todo",
    });
  }
};
