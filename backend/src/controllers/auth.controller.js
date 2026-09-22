import config from "../config/config.js";
import pool from "../db/db.js";
import { createSession } from "../utils/createSession.util.js";
import {
  comparePassword,
  generateHashedPassword,
} from "../utils/password.util.js";
import {
  generateAccessToken,
  generateHashedRefreshToken,
  generateRefreshToken,
} from "../utils/token.util.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const isAlreadyExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (isAlreadyExists.rows[0]) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await generateHashedPassword(password, 12);
    const insertQuery = `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email`;
    const user = await pool.query(insertQuery, [name, email, hashedPassword]);

    const refreshToken = generateRefreshToken(user.rows[0]);
    const hashedRefreshToken = generateHashedRefreshToken(refreshToken);

    const sessionQuery = `INSERT INTO sessions (user_id, hashed_refresh_token, refresh_token_expiry_at, ip, user_agent) VALUES ($1, $2, $3, $4, $5) RETURNING id`;

    const session = await pool.query(sessionQuery, [
      user.rows[0].id,
      hashedRefreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      req.ip,
      req.get("User-Agent"),
    ]);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    const accessToken = generateAccessToken(user.rows[0], session.rows[0].id);

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.rows[0].id,
          name: user.rows[0].name,
          email: user.rows[0].email,
        },
        accessToken: accessToken,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Failed to register user",
    });
  }
};

