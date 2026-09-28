import React, { useState } from "react";
import TextInput from "../../components/common/inputs/TextInput";
import PasswordInput from "../../components/common/inputs/PasswordInput";
import {
  loginSchema,
  type LoginInput,
} from "../../../../shared/schemas/auth.schema";

const Login = () => {
  const [data, setData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<Partial<Record<keyof LoginInput, string>>>({});

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

    if(!result.success) {
      result.error.issues.forEach((issue) => {
        setError((prevError) => ({
          ...prevError,
          [issue.path[0]]: issue.message,
        }));
      })
      console.log(result.error.issues[0].message);
      return
    }
    setError({});
    console.log('user logged in successfully', result.data);
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextInput
          name="email"
          placeholder="Email"
          value={data.email}
          handleChange={handleChange}
          type="email"
          title="Email"
          error=""
        />
        <PasswordInput
          name="password"
          placeholder="Password"
          value={data.password}
          handleChange={handleChange}
          title="Password"
          error=""
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
