import config from "../config/config.js";
import pool from "../db/db.js";
import { createSession } from "../utils/createSession.util.js";
import { v4 as uuidv4 } from "uuid";
import {
  comparePassword,
  generateHashedPassword,
} from "../utils/password.util.js";
import {
  compareHashedRefreshTokens,
  generateAccessToken,
  generateHashedRefreshToken,
  generateRefreshToken,
  verifyRefreshToken,
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

    const sessionID = uuidv4();
    const refreshToken = generateRefreshToken(user.rows[0], sessionID);
    const hashedRefreshToken = generateHashedRefreshToken(refreshToken);

    const session = await createSession(
      sessionID,
      user.rows[0],
      hashedRefreshToken,
      req.ip,
      req.get("User-Agent"),
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      maxAge: Number(config.REFRESH_TOKEN_LIFETIME),
    });
    const accessToken = generateAccessToken(user.rows[0], session.id);

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

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!user.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Invalid password or email",
      });
    }
    const isPasswordValid = await comparePassword(
      password,
      user.rows[0].password_hash,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password or email",
      });
    }
    const sessionID = uuidv4();
    const refreshToken = generateRefreshToken(user.rows[0], sessionID);
    const hashedRefreshToken = generateHashedRefreshToken(refreshToken);
    const session = await createSession(
      sessionID,
      user.rows[0],
      hashedRefreshToken,
      req.ip,
      req.get("User-Agent"),
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      maxAge: Number(config.REFRESH_TOKEN_LIFETIME), // 7 days
    });

    const accessToken = generateAccessToken(user.rows[0], session.id);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.rows[0].id,
          name: user.rows[0].name,
          email: user.rows[0].email,
        },
        accessToken: accessToken,
      },
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Failed to login user",
    });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token not found",
    });
  }
  try {
    const decode = verifyRefreshToken(refreshToken);
    const session = await pool.query("SELECT * FROM sessions WHERE id = $1", [
      decode.sessionId,
    ]);
    if (
      !session.rows[0] ||
      session.rows[0].revoked ||
      new Date(session.rows[0].refresh_token_expiry_at) < new Date()
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const isRefreshTokenValid = compareHashedRefreshTokens(
      session.rows[0].hashed_refresh_token,
      refreshToken,
    );
    if (!isRefreshTokenValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const refreshTokenNew = generateRefreshToken(
      session.rows[0].user_id,
      session.rows[0].id,
    );
    const hashedRefreshTokenNew = generateHashedRefreshToken(refreshTokenNew);
    const updateSessionQuery =
      "UPDATE sessions SET hashed_refresh_token = $1, refresh_token_expiry_at = $2 WHERE id = $3";
    await pool.query(updateSessionQuery, [
      hashedRefreshTokenNew,
      new Date(Date.now() + Number(config.REFRESH_TOKEN_LIFETIME)),
      session.rows[0].id,
    ]);
    const accessToken = generateAccessToken(
      session.rows[0].user_id,
      session.rows[0].id,
    );

    res.cookie("refreshToken", refreshTokenNew, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      maxAge: Number(config.REFRESH_TOKEN_LIFETIME),
    });

    return res.status(200).json({
      success: true,
      data: {
        accessToken: accessToken,
      },
      message: "Refresh token refreshed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Failed to refresh token",
    });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token not found",
    });
  }

  try {
    const decode = verifyRefreshToken(refreshToken);
    const session = await pool.query("SELECT * FROM sessions WHERE id = $1", [
      decode.sessionId,
    ]);
    if (
      !session.rows[0] ||
      session.rows[0].revoked ||
      new Date(session.rows[0].refresh_token_expiry_at) < new Date()
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const matchRefreshToken = compareHashedRefreshTokens(
      session.rows[0].hashed_refresh_token,
      refreshToken,
    );
    if (!matchRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const sessionUpdateQuery =
      "UPDATE sessions SET revoked = $1, revoked_at = $2 WHERE id = $3";
    await pool.query(sessionUpdateQuery, [
      true,
      new Date(),
      session.rows[0].id,
    ]);
    res.clearCookie("refreshToken");
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Failed to logout user",
    });
  }
};

export const logoutAll = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token not found",
    });
  }
  try {
    const decode = verifyRefreshToken(refreshToken);
    const userSessions = await pool.query(
      "UPDATE sessions SET revoked = $1, revoked_at = $2 WHERE user_id = $3 AND revoked = $4",
      [true, new Date(), decode.id, false],
    );

    res.clearCookie("refreshToken");
    return res.status(200).json({
      success: true,
      message: "All sessions terminated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Failed to logout user",
    });
  }
};
