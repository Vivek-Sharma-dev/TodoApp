import { generateOtp, hashOtpFn } from "../utils/otp.utils.js";
import config from "../config/config.js";
import AppError from "../utils/AppError.js";

export const createVerificationToken = async (db, user, token_type) => {
  const otp = generateOtp();
  const hashedOtp = hashOtpFn(otp);

  // insert hash otp into verification_token
  const insertOtpQuery =
    "INSERT INTO verification_tokens (user_id, token_hash, token_type, expires_at) VALUES ($1, $2, $3, $4);";

  await db.query(insertOtpQuery, [
    user.user_id,
    hashedOtp,
    token_type,
    new Date(Date.now() + config.OTP_LIFETIME),
  ]);

  return otp;
};

export const verifyOtp = async (db, userId, submittedOtp, token_type) => {
  const activeVerifiication = await db.query(
    "SELECT * FROM verification_tokens WHERE user_id = $1 AND token_type = $2 AND used_at IS NULL",
    [userId, token_type],
  );

  if (activeVerifiication.rowCount <= 0) {
    throw new AppError("Verification token not found", 401);
  }

  const otpRow = activeVerifiication.rows[0];

  if (otpRow.expires_at < new Date()) {
    throw new AppError("OTP is expired", 401);
  }

  if (otpRow.attempt_count >= otpRow.max_attempts) {
    throw new AppError("OTP limit is reached", 403);
  }

  if (otpRow.token_hash !== hashOtpFn(submittedOtp)) {
    await db.query(
      "UPDATE verification_tokens  SET attempt_count = attempt_count + 1  WHERE ID = $1",
      [otpRow.id],
    );
    throw new AppError("OTP is not matched", 401);
  }
  await db.query("UPDATE verification_tokens  SET used_at = $1 WHERE ID = $2", [
    new Date(),
    otpRow.id,
  ]);
  return true;
};
