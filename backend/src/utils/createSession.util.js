import pool from "../db/db.js";


export const createSession = async (user, hashedRefreshToken, ip, userAgent) => {
    const sessionQuery = `INSERT INTO sessions (user_id, hashed_refresh_token, refresh_token_expiry_at, ip, user_agent) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const session = await pool.query(sessionQuery, [user.id, hashedRefreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), ip, userAgent]);
    return session.rows[0];
}