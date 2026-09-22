import { verifyToken } from "../utils/token.util.js";
import pool from "../db/db.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token not found",
    });
  }

  try {
    const accessToken = authHeader.split(" ")[1];
    const decode = verifyToken(accessToken);
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
    const user = {
      id: decode.id,
      sessionId: decode.sessionId,
    };
    req.user = user;
    console.log(user)
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
