import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

interface PasswordInputProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    error: string;
    name: string
    title: string;
    placeholder: string
    autoComplete?: string
}

const PasswordInput = ({handleChange, value, error, name, title, placeholder, autoComplete}: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div>
        <label
          htmlFor={title}
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          {title}
        </label>

        <div className="relative">
          <input
            id={name}
            name={name}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            autoComplete={autoComplete}
            className={`w-full rounded-input border bg-background px-4 py-3 pr-11 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:ring-2 ${
              error
                ? "border-error/60 focus:border-error focus:ring-error/10"
                : "border-border focus:border-brand focus:ring-brand/10"
            }`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text-primary"
            aria-label={showPassword ? "Hide value" : "Show value"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-xs text-error">{error}</p>
        )}
      </div>
    </>
  );
};

export default PasswordInput;
