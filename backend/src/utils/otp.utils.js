import crypto from "crypto";

export const generateOtp = () => {
  const OTP_LENGTH = 6;
  return String(crypto.randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH));
};

export const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
