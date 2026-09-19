import { Router } from "express"
import pool from "../db/db.js";


const todoRouter = Router();

todoRouter.get('/test', async (req, res) => {
    const result = await pool.query("SELECT * FROM users; ");
    console.log(result)
    res.json(result.rows)
})
export default todoRouter;