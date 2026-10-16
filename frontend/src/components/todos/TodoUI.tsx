import { TodoOptions } from "./TodoOptions";
import { type TodoTypeFrontend } from "../../types/todos/todo.type";
import { CalendarDays, Circle } from "lucide-react";
import { useState } from "react";
import { useDeleteTodo } from "../../hooks/todos/useDeleteTodo";
import EditTodoModal from "./EditTodoModal";



const TodoUI = ({ todo }: { todo: TodoTypeFrontend }) => {
  const [editModal, setEditModal] = useState<boolean>(false);
  const { mutate, isPending, error } = useDeleteTodo();

  return (
    <>
      <div className="group flex items-start gap-4 p-5 transition hover:bg-background/50">
        <button
          type="button"
          aria-label={`Mark ${todo.title} as complete`}
          className="mt-0.5 shrink-0 text-text-muted transition hover:text-brand"
        >
          <Circle className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <h4 className="text-sm font-medium text-text-primary">
              {todo.title}
            </h4>
            <span
              className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                todo.priority === "high"
                  ? "bg-error/10 text-error"
                  : todo.priority === "medium"
                    ? "bg-warning/10 text-warning"
                    : "bg-success/10 text-success"
              }`}
            >
              {todo.priority}
            </span>
          </div>

          {todo.description && (
            <p className="mt-1 line-clamp-2 text-xs text-text-muted">
              {todo.description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
            <CalendarDays className="h-3.5 w-3.5" />
            Due {new Date(todo.due_date).toLocaleString()}
          </div>
        </div>

        <TodoOptions
          completed={todo.completed}
          onEdit={() => {
            setEditModal(true);
          }}
          onToggleComplete={() => {
            console.log("Toggle Todo:", todo.id);
          }}
          onDelete={() => {
            mutate(todo.id);
          }}
          />

          {editModal && <EditTodoModal /> }
      </div>
    </>
  );
};

export default TodoUI;
