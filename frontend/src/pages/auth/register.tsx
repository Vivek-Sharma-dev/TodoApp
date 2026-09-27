import React, { useState } from "react";
import {
  registerSchema,
  type RegisterInput,
} from "../../../../shared/schemas/auth.schema.ts";
import { useRegister } from "../../hooks/auth/useRegister.tsx";

const Register = () => {
  const [formData, setFormData] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { data, error, isPending, mutate } = useRegister();

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
    mutate(result.data);
  };
  return (
    <>
      <section>
        <div>
          <h1>Create your account</h1>
          <p>Create an account to start managing your todos.</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="false">
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p>{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p>{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          </div>
          <button type="submit">Create account</button>
        </form>
      </section>
    </>
  );
};

export default Register;
