export type TodoType = {
  success: boolean;
  data: [
    {
      id: string;
      user_id: string;
      title: string;
      description: string | null;
      completed: boolean;
      created_at: string;
      updated_at: string;
      due_date: string;
      priority: "low" | "medium" | "high";
    },
  ];
  meta: {
    totalTodos: number;
  };
  message: string;
};


export type AddTodoServerResponse = {
  success: boolean;
  data: {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    completed: boolean;
    created_at: Date;
    updated_at: Date;
    due_date: Date;
    priority: "low" | "medium" | "hard"
  }
  message: string
}