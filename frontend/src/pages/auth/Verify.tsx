import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, MailCheck, ShieldCheck } from "lucide-react";

import { emailVerificationSchema } from "../../../../shared/schemas/auth.schema.ts";
import OtpInput from "../../components/common/inputs/OtpInput.tsx";
import { useVerify } from "../../hooks/auth/useVerify.tsx";

const Verify = () => {
  // states
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();

  // api call hook
  const { error, isPending, mutate } = useVerify();

  // form handling
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = emailVerificationSchema.safeParse({ otp });

    if (!result.success) {
      setOtpError(result.error.issues[0].message);
      return;
    }

    setOtpError("");

    mutate(result.data, {
      onSuccess: () => {
        navigate("/", { replace: true });
      },
    });
  };

  return (
    <div>
      {/* Icon */}
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
        <MailCheck className="h-6 w-6" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-brand">
          Verify your email
        </h1>

        <p className="mt-2 text-sm leading-6 text-text-secondary">
          We've sent a 6-digit verification code to your email address.
          Enter the code below to continue.
        </p>
      </div>

      {/* Server error */}
      {error && (
        <div className="mb-5 rounded-input border border-error/20 bg-error/10 px-4 py-3">
          <p className="text-sm text-error">
            {error.response?.data?.message ||
              "Verification failed. Please try again."}
          </p>
        </div>
      )}

      {/* Verification form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label className="mb-3 block text-sm font-medium text-text-primary">
            Verification code
          </label>

          <OtpInput
            value={otp}
            onChange={(value) => {
              setOtp(value);

              if (otpError) {
                setOtpError("");
              }
            }}
            error={otpError}
          />
        </div>

        {/* Verify button */}
        <button
          type="submit"
          disabled={isPending}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-button  px-4 py-3 text-sm font-semibold  disabled:cursor-not-allowed disabled:opacity-60 btn-after-animation"
        >
          {isPending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              Verify email
            </>
          )}
        </button>
      </form>

      {/* Security note */}
      <div className="mt-7 flex items-start gap-3 rounded-input border border-border bg-background/50 px-4 py-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />

        <p className="text-xs leading-5 text-text-muted">
          For your security, never share your verification code with anyone.
        </p>
      </div>

      {/* Help text */}
      <p className="mt-6 text-center text-xs leading-5 text-text-muted">
        Didn't receive the code? Check your spam or junk folder.
      </p>
    </div>
  );
};

export default Verify;