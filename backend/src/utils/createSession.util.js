import config from "../config/config.js";

export const createSession = async (
  db,
  sessionID,
  user,
  hashedRefreshToken,
  ip,
  userAgent,
) => {
  const sessionQuery = `INSERT INTO sessions (id, user_id, hashed_refresh_token, refresh_token_expiry_at, ip, user_agent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
  const session = await db.query(sessionQuery, [
    sessionID,
    user.id,
    hashedRefreshToken,
    new Date(Date.now() + config.REFRESH_TOKEN_LIFETIME),
    ip,
    userAgent,
  ]);

  if (!session.rows[0]) {
    throw new Error("Session creation failed");
  }
  return session.rows[0];
};
