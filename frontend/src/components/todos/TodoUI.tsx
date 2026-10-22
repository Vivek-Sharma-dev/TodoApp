import { TodoOptions } from "./TodoOptions";
import { type TodoTypeFrontend } from "../../types/todos/todo.type";
import { CalendarDays, Circle } from "lucide-react";
import { useState } from "react";
import { useDeleteTodo } from "../../hooks/todos/useDeleteTodo";
import UpdateTodoModal from "./UpdateTodoModal";
import { useUpdateTodo } from "../../hooks/todos/useUpdateTodo";
import ConfirmationModal from "./ConfirmationModal";

const TodoUI = ({ todo }: { todo: TodoTypeFrontend }) => {
  const [editModal, setEditModal] = useState<boolean>(false);
  const [completeConfirmation, setCompleteConfirmation] =
    useState<boolean>(false);
  const [confirmDeletion, setConfirmDeletion] = useState<boolean>(false);
  const {
    mutate: deleteTodo,
    isPending: isDeleting,
    error: deletingError,
  } = useDeleteTodo();
  const {
    mutate: updateTodoMutation,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateTodo();

  const handleDeletion = () => {
    deleteTodo(todo.id, { onSuccess: () => setConfirmDeletion(false) });
  };

  const handleCompletion = () => {
    updateTodoMutation(
      {
        id: todo.id,
        data: {
          completed: true,
        },
      },
      {
        onSuccess: () => setCompleteConfirmation(false),
      },
    );
  };
  return (
    <>
      <div className="group flex items-start gap-4 p-5 transition hover:bg-background/50">
        <button
          type="button"
          onClick={() => setCompleteConfirmation((prev) => !prev)}
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
          onToggleComplete={() => setCompleteConfirmation(true)}
          onDelete={() => setConfirmDeletion(true)}
        />

        {editModal && (
          <UpdateTodoModal
            todo={todo}
            setUpdateTodo={setEditModal}
            onSave={(id, updatedData) => {
              updateTodoMutation({
                id,
                data: {
                  title: updatedData.title,
                  description: updatedData.description,
                  priority: updatedData.priority,
                  due_date: updatedData.due_date?.toISOString() ?? null,
                },
              });
            }}
            isPending={isUpdating}
            serverError={updateError?.message}
          />
        )}
      </div>
      {completeConfirmation && (
        <ConfirmationModal
          action={"completed"}
          actionName="Mark as Completed"
          description={`Are you sure you want to mark ${todo.title} as completed?`}
          onConfirm={handleCompletion}
          onClose={() => setCompleteConfirmation(false)}
          isPending={isUpdating}
          isError={updateError?.message}
        />
      )}
      {confirmDeletion && (
        <ConfirmationModal
          action={"deletion"}
          actionName="Delete Todo"
          description={`Are you sure you want to Delete ${todo.title}? This action can't be undone`}
          onConfirm={handleDeletion}
          onClose={() => setConfirmDeletion(false)}
          isPending={isDeleting}
          isError={deletingError?.message}
        />
      )}
    </>
  );
};

export default TodoUI;
