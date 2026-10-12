export type TodoType = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
  due_date: string;
  priority: "low" | "medium" | "high";
};