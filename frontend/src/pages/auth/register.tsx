import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import '../../styles/component.style.css';

import {
  registerSchema,
  type RegisterInput,
} from "../../../../shared/schemas/auth.schema.ts";

import { useRegister } from "../../hooks/auth/useRegister.tsx";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { error, isPending, mutate } = useRegister();

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterInput, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = registerSchema.safeParse(formData);

    console.log(result);

    if (!result.success) {
      const fieldError: Partial<Record<keyof RegisterInput, string>> = {};

      result.error.issues.forEach((issue) => {
        fieldError[issue.path[0] as keyof RegisterInput] = issue.message;
      });

      setErrors(fieldError);
      return;
    }

    setErrors({});

    mutate(result.data, {
      onSuccess: () => {
        navigate("/auth/verify", { replace: true });
      },
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-brand">
          Create your account
        </h1>

        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Create an account to start managing your todos.
        </p>
      </div>

      {/* Server error */}
      {error && (
        <div className="mb-5 rounded-input border border-error/20 bg-error/10 px-4 py-3">
          <p className="text-sm text-error">
            {error.response?.data?.message || "Something went wrong."}
          </p>
        </div>
      )}

      {/* Register form */}
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            className={`w-full rounded-input border bg-background px-4 py-3 text-sm text-text-primary outline-none transition-all duration-300 placeholder:text-text-muted focus:ring-2 ${
              errors.name
                ? "border-error/60 focus:border-error focus:ring-error/10"
                : "border-border focus:border-brand focus:ring-brand/10"
            }`}
          />

          {errors.name && (
            <p className="mt-2 text-xs text-error">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            className={`w-full rounded-input border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:ring-2 ${
              errors.email
                ? "border-error/60 focus:border-error focus:ring-error/10"
                : "border-border focus:border-brand focus:ring-brand/10"
            }`}
          />

          {errors.email && (
            <p className="mt-2 text-xs text-error">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className={`w-full rounded-input border bg-background px-4 py-3 pr-11 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:ring-2 ${
                errors.password
                  ? "border-error/60 focus:border-error focus:ring-error/10"
                  : "border-border focus:border-brand focus:ring-brand/10"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text-primary"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-2 text-xs text-error">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Confirm Password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className={`w-full rounded-input border bg-background px-4 py-3 pr-11 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:ring-2 ${
                errors.confirmPassword
                  ? "border-error/60 focus:border-error focus:ring-error/10"
                  : "border-border focus:border-brand focus:ring-brand/10"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text-primary"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-2 text-xs text-error">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-button relative px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 btn-after-animation"
        >
          {isPending ? "Creating account..." : "Create account"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />

        <span className="text-xs text-text-muted">OR CONTINUE WITH</span>

        <div className="h-px flex-1 bg-border" />
      </div>

      {/* OAuth buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-2 rounded-button border border-border bg-background px-4 py-3 text-sm font-medium text-text-secondary opacity-70"
        >
          <span className="font-bold">G</span>
          Google
        </button>

        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-2 rounded-button border border-border bg-background px-4 py-3 text-sm font-medium text-text-secondary opacity-70"
        >
          <span className="font-bold">f</span>
          Facebook
        </button>
      </div>

      {/* Login */}
      <p className="mt-7 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/auth/login")}
          className="font-medium text-brand transition hover:text-brand-hover"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default Register;
