import React, { useRef } from "react";

type OtpInputProps = {
  value: string;
  onChange: (otp: string) => void;
  error?: string;
};

const OtpInput = ({ value, onChange, error }: OtpInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const inputValue = e.target.value;
    console.log(inputValue);

    // Allow only numbers
    if (!/^\d*$/.test(inputValue)) {
      return;
    }

    // Only keep one digit for the current box
    const digit = inputValue.slice(-1);

    const otpArray = value.split("");

    otpArray[index] = digit;

    const newOtp = otpArray.join("").slice(0, 6);

    onChange(newOtp);

    // Move to next box
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div>
      <div className="flex justify-between gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] ?? ""}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            className={`h-12 w-12 rounded-input border bg-background text-center text-lg font-semibold text-text-primary outline-none transition-all duration-200 focus:ring-2 ${
              error
                ? "border-error/60 focus:border-error focus:ring-error/10"
                : "border-border focus:border-brand focus:ring-brand/10"
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="mt-2 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default OtpInput;