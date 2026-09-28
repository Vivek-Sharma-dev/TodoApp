import React, { useState } from "react";
import { emailVerificationSchema } from "../../../../shared/schemas/auth.schema.ts";
import OtpInput from "../../components/common/inputs/OtpInput.tsx";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  console.log(otp)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("OTP:", otp);

    const result = emailVerificationSchema.safeParse({ otp });

    if (!result.success) {
      setOtpError(result.error.issues[0].message);
      console.log(result.error.issues[0].message);
      return;
    }

    setOtpError("");

    console.log("OTP is valid:", result.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <OtpInput
        value={otp}
        onChange={(value) => {
          setOtp(value);
          console.log("OTP changed:", value);
        }}
        error={otpError}
      />

      <button type="submit">
        Verify
      </button>
    </form>
  );
};

export default Verify;