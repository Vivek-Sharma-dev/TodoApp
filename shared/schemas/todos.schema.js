import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().trim().min(3, "Title is too short"),
  description: z.string().trim().optional(),
  priority: z.enum(
    ["low", "medium", "high"],
    "Priority must be one of low, medium, or high",
  ),
  due_date: z.coerce.date("Due Date is invalid"),
});

export const updateTodoSchema = z
  .object({
    title: z.string().trim().min(3, "Title is too short").optional(),
    description: z.string().trim().optional(),
    priority: z
      .enum(
        ["low", "medium", "high"],
        "Priority must be one of low, medium, or high",
      )
      .optional(),
    completed: z.boolean().optional(),
    due_date: z.coerce.date("Due Date is invalid").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
