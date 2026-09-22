import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .max(30, "Name must be at most 30 characters long"),
  email: z.string()
    .trim()
    .email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
});
