import { useState } from "react";
import {
  AlignLeft,
  CalendarDays,
  ChevronDown,
  Flag,
  Pencil,
  X,
} from "lucide-react";

import { updateTodoSchema } from "../../../../shared/schemas/todos.schema";
import TodoDateTimePicker from "./TodoDateTimePicker";
import type { TodoTypeFrontend } from "../../types/todos/todo.type";

type Priority = "low" | "medium" | "high";

type UpdateTodoFormData = {
  title: string;
  description: string;
  priority: Priority;
  due_date: Date | null;
};

type UpdateTodoModalProps = {
  todo: TodoTypeFrontend;
  setUpdateTodo: (open: boolean) => void;
  onSave: (id: string, data: UpdateTodoFormData) => void;
  isPending?: boolean;
  serverError?: string;
};

const priorityOptions: {
  value: Priority;
  label: string;
  dot: string;
}[] = [
  { value: "low", label: "Low", dot: "bg-emerald-400" },
  { value: "medium", label: "Medium", dot: "bg-amber-400" },
  { value: "high", label: "High", dot: "bg-rose-400" },
];

const toDate = (value: Date | string | null): Date | null => {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const UpdateTodoModal = ({
  todo,
  setUpdateTodo,
  onSave,
  isPending = false,
  serverError,
}: UpdateTodoModalProps) => {
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [validationError, setValidationError] = useState<{
    title: string;
    description: string;
    priority: string;
    due_date: string;
    form: string;
  } | null>(null);

  const [data, setData] = useState<UpdateTodoFormData>({
    title: todo.title,
    description: todo.description ?? "",
    priority: todo.priority,
    due_date: toDate(todo.due_date),
  });
  const currentPriority =
    priorityOptions.find((option) => option.value === data.priority) ??
    priorityOptions[1];

  const getFieldError = (field: keyof UpdateTodoFormData) =>
    validationError?.[field] ?? "";

  const updateField = <K extends keyof UpdateTodoFormData>(
    field: K,
    value: UpdateTodoFormData[K],
  ) => {
    setData((previous) => ({ ...previous, [field]: value }));

    setValidationError((previous) => {
      if (!previous) return null;
      return { ...previous, [field]: "" };
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setUpdateTodo(false);
    }
  };

  const handleSubmit = () => {
    setValidationError(null);

    const payload = {
      title: data.title.trim(),
      description: data.description.trim(),
      priority: data.priority,
      ...(data.due_date !== null && {
        due_date: data.due_date,
      }),
    };

    // Validate using the shared Zod schema.
    const result = updateTodoSchema.safeParse(payload);

    if (!result.success) {
      const nextErrors = {
        title: "",
        description: "",
        priority: "",
        due_date: "",
        form: "",
      };

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (
          typeof field === "string" &&
          field in nextErrors &&
          !nextErrors[field as keyof typeof nextErrors]
        ) {
          nextErrors[field as keyof typeof nextErrors] = issue.message;
        }
      }

      setValidationError(nextErrors);

      if (nextErrors.due_date) {
        setIsDatePickerOpen(true);
      }

      return;
    }

    if (data.due_date && data.due_date.getTime() <= Date.now()) {
      setValidationError({
        title: "",
        description: "",
        priority: "",
        due_date: "Choose a future date and time.",
        form: "",
      });

      setIsDatePickerOpen(true);
      return;
    }

    // Compare current values with the original todo.
    const originalDueDate = toDate(todo.due_date);

    const hasChanges =
      data.title.trim() !== todo.title ||
      data.description.trim() !== (todo.description ?? "") ||
      data.priority !== todo.priority ||
      (data.due_date?.getTime() ?? null) !==
        (originalDueDate?.getTime() ?? null);

    if (!hasChanges) {
      setValidationError({
        title: "",
        description: "",
        priority: "",
        due_date: "",
        form: "Make at least one change before saving.",
      });

      return;
    }

    onSave(todo.id, {
      title: data.title.trim(),
      description: data.description.trim(),
      priority: data.priority,
      due_date: data.due_date,
    });

    if(!isPending) setUpdateTodo(false)
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-todo-title"
        className="my-auto w-full max-w-2xl overflow-visible rounded-2xl border border-border bg-surface shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Pencil size={20} />
            </div>

            <div>
              <h2
                id="update-todo-title"
                className="text-lg font-semibold text-text-primary"
              >
                Update task
              </h2>
              <p className="mt-0.5 text-sm text-text-secondary">
                Make changes to your task details.
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close modal"
            disabled={isPending}
            onClick={handleClose}
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
          className="space-y-5 px-6 py-6"
        >
          {serverError && (
            <div
              role="alert"
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400"
            >
              {serverError}
            </div>
          )}

          {validationError?.form && (
            <p role="alert" className="text-sm text-rose-400">
              {validationError.form}
            </p>
          )}
          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="update-todo-title-input"
              className="text-sm font-medium text-text-primary"
            >
              Task title
            </label>

            <input
              id="update-todo-title-input"
              type="text"
              autoFocus
              maxLength={100}
              value={data.title}
              aria-invalid={Boolean(getFieldError("title"))}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="What needs to be done?"
              disabled={isPending}
              className={`w-full rounded-xl border ${
                getFieldError("title") ? "border-rose-500" : "border-border"
              } bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-brand focus:ring-2 focus:ring-brand/10 disabled:opacity-50`}
            />

            {getFieldError("title") && (
              <p className="text-sm text-rose-400">{getFieldError("title")}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="update-todo-description"
              className="flex items-center gap-2 text-sm font-medium text-text-primary"
            >
              <AlignLeft size={15} className="text-text-secondary" />
              Description
              <span className="font-normal text-text-secondary">
                (optional)
              </span>
            </label>

            <textarea
              id="update-todo-description"
              rows={3}
              value={data.description}
              aria-invalid={Boolean(getFieldError("description"))}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Add some details about this task..."
              disabled={isPending}
              className={`w-full resize-none rounded-xl border ${
                getFieldError("description")
                  ? "border-rose-500"
                  : "border-border"
              } bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-brand focus:ring-2 focus:ring-brand/10 disabled:opacity-50`}
            />

            {getFieldError("description") && (
              <p className="text-sm text-rose-400">
                {getFieldError("description")}
              </p>
            )}
          </div>

          {/* Priority and due date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <Flag size={15} className="text-text-secondary" />
                Priority
              </label>

              <div className="relative">
                <button
                  type="button"
                  disabled={isPending}
                  aria-expanded={isPriorityOpen}
                  onClick={() => setIsPriorityOpen((previous) => !previous)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm transition hover:border-brand/60 disabled:opacity-50"
                >
                  <span className="flex items-center gap-2 text-text-primary">
                    <span
                      className={`size-2.5 rounded-full ${currentPriority.dot}`}
                    />
                    {currentPriority.label}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`text-text-secondary transition-transform ${
                      isPriorityOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isPriorityOpen && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-border bg-surface p-1.5 shadow-xl">
                    {priorityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          updateField("priority", option.value);
                          setIsPriorityOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                          data.priority === option.value
                            ? "bg-brand/10 text-brand"
                            : "text-text-secondary hover:bg-background hover:text-text-primary"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`size-2.5 rounded-full ${option.dot}`}
                          />
                          {option.label}
                        </span>

                        {data.priority === option.value && (
                          <span className="text-xs">Selected</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {getFieldError("priority") && (
                <p className="text-sm text-rose-400">
                  {getFieldError("priority")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <CalendarDays size={15} className="text-text-secondary" />
                Due date & time
                <span className="font-normal text-text-secondary">
                  (optional)
                </span>
              </label>

              <button
                type="button"
                disabled={isPending}
                aria-expanded={isDatePickerOpen}
                onClick={() => setIsDatePickerOpen((previous) => !previous)}
                className={`flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border ${
                  getFieldError("due_date")
                    ? "border-rose-500"
                    : "border-border"
                } bg-background px-3 py-3 text-left text-sm transition hover:border-brand/60 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <span
                  className={`min-w-0 truncate ${
                    data.due_date
                      ? "text-text-primary"
                      : "text-text-secondary/70"
                  }`}
                >
                  {data.due_date
                    ? `${formattedDate || data.due_date.toLocaleDateString()} · ${
                        formattedTime ||
                        data.due_date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }`
                    : "No due date"}
                </span>

                <CalendarDays
                  size={16}
                  className="shrink-0 text-text-secondary"
                />
              </button>

              {getFieldError("due_date") && (
                <p className="text-sm text-rose-400">
                  {getFieldError("due_date")}
                </p>
              )}
            </div>
          </div>

          <TodoDateTimePicker
            isOpen={isDatePickerOpen}
            onOpenChange={setIsDatePickerOpen}
            value={data.due_date}
            onChange={(dueDate) => updateField("due_date", dueDate)}
            disabled={isPending}
            error={getFieldError("due_date")}
            setFormattedDate={setFormattedDate}
            setFormattedTime={setFormattedTime}
          />

          {/* Footer */}
          <div className="-mx-6 -mb-6 flex justify-end gap-3 rounded-b-2xl border-t border-border bg-background/50 px-6 py-4">
            <button
              type="button"
              disabled={isPending}
              onClick={handleClose}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-background hover:text-text-primary disabled:opacity-50"
            >
              Cancel
            </button>

            <button

              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Pencil size={16} />
              {isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTodoModal;
