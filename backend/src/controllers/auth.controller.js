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
  verifyToken,
} from "../utils/token.util.js";
import AppError from "../utils/AppError.js";
import { sendVerificationOtp } from "../services/email.service.js";
import { generateOtp, hashOtp } from "../utils/otp.utils.js";

// register a new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const isAlreadyExists = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (isAlreadyExists.rows[0]) {
      throw new AppError("User is already exist", 409);
    }
    const hashedPassword = await generateHashedPassword(password, 12);
    const insertQuery = `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email`;
    const user = await client.query(insertQuery, [name, email, hashedPassword]);

    const sessionID = uuidv4();
    const refreshToken = generateRefreshToken(user.rows[0], sessionID);
    const hashedRefreshToken = generateHashedRefreshToken(refreshToken);

    const session = await createSession(
      client,
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
    
    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);
    const storeOtpQuery = `INSERT INTO verification_tokens (token_hash, token_type, user_id, expires_at, attempt_count) VALUES ($1, $2, $3, $4, $5)`;
    await client.query(storeOtpQuery, [
      hashedOtp,
      "EMAIL_VERIFICATION",
      user.rows[0].id,
      new Date(Date.now() + config.OTP_LIFETIME),
      0,
    ]);
    await client.query("COMMIT");

    // send otp email after commit to prevent race condition
    sendVerificationOtp(email, otp);

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.rows[0].id,
          name: user.rows[0].name,
          email: user.rows[0].email,
        },
      },
      message: "User registered successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const emailVerification = async (req, res) => {
  const otp = generateOtp();
  sendVerificationOtp("viveksharmaa252@gmail.com", otp);
};

// log in a user
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (!user.rows[0]) {
    throw new AppError("Invalid password or email", 404);
  }
  const isPasswordValid = await comparePassword(
    password,
    user.rows[0].password_hash,
  );
  if (!isPasswordValid) {
    throw new AppError("Invalid password or email", 401);
  }
  const sessionID = uuidv4();
  const refreshToken = generateRefreshToken(user.rows[0], sessionID);
  const hashedRefreshToken = generateHashedRefreshToken(refreshToken);
  const session = await createSession(
    pool,
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
    maxAge: config.REFRESH_TOKEN_LIFETIME, // 7 days
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
};

// refresh the access token
export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("refresh token is: ", refreshToken);
  if (!refreshToken) {
    throw new AppError("Refresh token not found", 401);
  }
  const decode = verifyToken(refreshToken);
  const session = await pool.query("SELECT * FROM sessions WHERE id = $1", [
    decode.sessionId,
  ]);
  const user = await pool.query(
    "SELECT email, name, id FROM users WHERE id = $1",
    [decode.id],
  );
  if (
    !session.rows[0] ||
    session.rows[0].revoked ||
    new Date(session.rows[0].refresh_token_expiry_at) < new Date()
  ) {
    throw new AppError("Invalid token", 401);
  }

  const isRefreshTokenValid = compareHashedRefreshTokens(
    session.rows[0].hashed_refresh_token,
    refreshToken,
  );
  if (!isRefreshTokenValid) {
    throw new AppError("Invalid token", 401);
  }

  const refreshTokenNew = generateRefreshToken(
    user.rows[0],
    session.rows[0].id,
  );
  const hashedRefreshTokenNew = generateHashedRefreshToken(refreshTokenNew);
  const updateSessionQuery =
    "UPDATE sessions SET hashed_refresh_token = $1, refresh_token_expiry_at = $2 WHERE id = $3";
  await pool.query(updateSessionQuery, [
    hashedRefreshTokenNew,
    new Date(Date.now() + config.REFRESH_TOKEN_LIFETIME),
    session.rows[0].id,
  ]);
  const accessToken = generateAccessToken(user.rows[0], session.rows[0].id);

  res.cookie("refreshToken", refreshTokenNew, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "strict",
    maxAge: config.REFRESH_TOKEN_LIFETIME,
  });

  return res.status(200).json({
    success: true,
    data: {
      accessToken: accessToken,
    },
    message: "Refresh token refreshed successfully",
  });
};

// log out user from current session
export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("Refresh token not found", 401);
  }

  const decode = verifyToken(refreshToken);
  const session = await pool.query("SELECT * FROM sessions WHERE id = $1", [
    decode.sessionId,
  ]);
  if (
    !session.rows[0] ||
    session.rows[0].revoked ||
    new Date(session.rows[0].refresh_token_expiry_at) < new Date()
  ) {
    throw new AppError("invalid token", 401);
  }

  const matchRefreshToken = compareHashedRefreshTokens(
    session.rows[0].hashed_refresh_token,
    refreshToken,
  );
  if (!matchRefreshToken) {
    throw new AppError("invalid token", 401);
  }

  const sessionUpdateQuery =
    "UPDATE sessions SET revoked = $1, revoked_at = $2 WHERE id = $3";
  await pool.query(sessionUpdateQuery, [true, new Date(), session.rows[0].id]);
  res.clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

// log out user from all sessions except current session
export const logoutAll = async (req, res) => {
  const { id: userId } = req.user;
  await pool.query(
    "UPDATE sessions SET revoked = $1, revoked_at = $2 WHERE user_id = $3 AND revoked = $4",
    [true, new Date(), userId, false],
  );

  res.clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "All sessions terminated successfully",
  });
};

// get user information
export const getMe = async (req, res) => {
  const { id: userId } = req.user;
  const user = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
  if (!user.rows[0]) {
    throw new AppError("User not found", 404);
  }
  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
      },
    },
    message: "User information fetched successfully",
  });
};
