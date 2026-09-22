import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

// Generates a JWT refresh token for a user with a specific session ID.
export const generateRefreshToken = (user, sessionId) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      sessionId: sessionId
    },
    config.JWT_SECRET,
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRY,
    },
  );
};


// generate a jwt access token for a user with a specific session ID.
export const generateAccessToken = (user, sessionId) => {
  return jwt.sign(
    {
      id: user.id,
      sessionId: sessionId,
      email: user.email,
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
export const verifyToken = (refreshToken) => {
  try {
    const decode = jwt.verify(refreshToken, config.JWT_SECRET);
    return decode;
  } catch (error) {
    console.log("Error in verifying refresh token: ", error);
    return error;
  }
};

// compare hashed refresh tokens
export const compareHashedRefreshTokens = (refreshTokenDb, refreshTokenClient) => {
    const hashedRefreshToken = generateHashedRefreshToken(refreshTokenClient);
    console.log(hashedRefreshToken)
    console.log(refreshTokenDb)
    return hashedRefreshToken === refreshTokenDb;
}