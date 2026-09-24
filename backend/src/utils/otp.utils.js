import crypto from "crypto";

export const generateOtp = () => {
  const OTP_LENGTH = 6;
  return crypto.randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH);
};
