import { Pool } from "pg";
import config from "../config/config.js";

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;


//path for running migration files
// \i 'C:/Users/vivek/OneDrive/Desktop/fullStackProjects/01_TodoApp/backend/src/db/migrations/001_create_users.sql'x`