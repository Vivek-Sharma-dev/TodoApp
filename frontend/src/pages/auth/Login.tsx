import React, { useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

import TextInput from "../../components/common/inputs/TextInput";
import PasswordInput from "../../components/common/inputs/PasswordInput";

import {
  loginSchema,
  type LoginInput,
} from "../../../../shared/schemas/auth.schema";

import { useLogin } from "../../hooks/auth/useLogin";

const Login = () => {
  const [data, setData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<
    Partial<Record<keyof LoginInput, string>>
  >({});

  const navigate = useNavigate();

  const { error: loginError, isPending, mutate } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse(data);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        setError((prevError) => ({
          ...prevError,
          [issue.path[0] as keyof LoginInput]: issue.message,
        }));
      });

      return;
    }

    setError({});

    mutate(result.data, {
      onSuccess: () => {
        navigate("/desktop", { replace: true });
      },
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <LockKeyhole className="h-6 w-6" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Welcome back
        </h1>

        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Sign in to continue managing your tasks and stay productive.
        </p>
      </div>

      {/* Server error */}
      {loginError && (
        <div className="mb-5 rounded-input border border-error/20 bg-error/10 px-4 py-3">
          <p className="text-sm text-error">
            {loginError.response?.data?.message ||
              "Unable to sign in. Please check your credentials and try again."}
          </p>
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextInput
          name="email"
          placeholder="you@example.com"
          value={data.email}
          handleChange={handleChange}
          type="email"
          title="Email"
          error={error.email || ""}
        />

        <PasswordInput
          name="password"
          placeholder="Enter your password"
          value={data.password}
          handleChange={handleChange}
          title="Password"
          error={error.password || ""}
          autoComplete="current-password"
        />

        {/* Login button */}
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-button px-4 py-3 text-sm font-semibold  disabled:cursor-not-allowed disabled:opacity-60 btn-after-animation"
        >
          {isPending ? (
            "Signing in..."
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />

        <span className="text-xs text-text-muted">
          OR CONTINUE WITH
        </span>

        <div className="h-px flex-1 bg-border" />
      </div>

      {/* OAuth */}
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

      {/* Register */}
      <p className="mt-7 text-center text-sm text-text-secondary">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/auth/register")}
          className="font-medium text-brand transition hover:text-brand-hover"
        >
          Create an account
        </button>
      </p>
    </div>
  );
};

export default Login;