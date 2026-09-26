import { generateOtp, hashOtpFn } from "../utils/otp.utils.js";
import config from "../config/config.js";

export const createVerificationToken = async (db, user) => {
  const otp = generateOtp();
  const hashedOtp = hashOtpFn(otp);

  // insert hash otp into verification_token
  const insertOtpQuery =
    "INSERT INTO verification_tokens (user_id, token_hash, token_type, expires_at) VALUES ($1, $2, $3, $4) RETURNING id;";

  const otpInsert = await db.query(insertOtpQuery, [
    user.user_id,
    hashedOtp,
    "EMAIL_VERIFICATION",
    new Date(Date.now() + config.OTP_LIFETIME),
  ]);

  return otp;
};
