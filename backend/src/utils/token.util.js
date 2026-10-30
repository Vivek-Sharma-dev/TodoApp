import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import AppError from "./AppError.js";

// Generates a JWT refresh token for a user with a specific session ID.
export const generateRefreshToken = (user, sessionId, type) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      sessionId: sessionId,
      type: type,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRY,
    },
  );
};


// generate a jwt access token for a user with a specific session ID.
export const generateAccessToken = (user, sessionId, type) => {
  return jwt.sign(
    {
      id: user.id,
      sessionId: sessionId,
      email: user.email,
      type: type,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRY,
    },
  );
};


// generate a hashed version of refresh token
export const generateHashedRefreshToken = (refreshToken) => {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
};

// verify refresh token
export const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, config.JWT_SECRET);
    return decode;
  } catch (error) {
    throw new AppError(error.message, 401);
  }
};

// compare hashed refresh tokens
export const compareHashedRefreshTokens = (refreshTokenDb, refreshTokenClient) => {
    const hashedRefreshToken = generateHashedRefreshToken(refreshTokenClient);
    return hashedRefreshToken === refreshTokenDb;
}