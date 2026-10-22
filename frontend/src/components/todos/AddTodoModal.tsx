import { useState } from "react";
import {
  AlignLeft,
  CalendarDays,
  ChevronDown,
  Flag,
  Plus,
  X,
} from "lucide-react";

import {
  createTodoSchema,
  type AddTodoType,
} from "../../../../shared/schemas/todos.schema";
import { useAddTodo } from "../../hooks/todos/useAddTodo";
import TodoDateTimePicker from "./TodoDateTimePicker";

type Priority = "low" | "medium" | "high";

type TodoFieldErrors = {
  title: string;
  description: string;
  priority: string;
  due_date: string;
};

const initialErrors: TodoFieldErrors = {
  title: "",
  description: "",
  priority: "",
  due_date: "",
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

const AddTodoModal = ({
  setAddTodo,
}: {
  setAddTodo: (open: boolean) => void;
}) => {
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [formattedTime, setFormattedTime] = useState<string>("");

  const [data, setData] = useState<AddTodoType>({
    title: "",
    description: "",
    priority: "medium",
    due_date: null,
  });

  const [errors, setErrors] = useState<TodoFieldErrors>(initialErrors);
  const [serverError, setServerError] = useState("");

  const { mutate, isPending } = useAddTodo();

  const currentPriority =
    priorityOptions.find((option) => option.value === data.priority) ??
    priorityOptions[1];

  const updateField = <K extends keyof AddTodoType>(
    field: K,
    value: AddTodoType[K],
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setServerError("");
  };

  const handleSubmit = () => {
    setErrors(initialErrors);
    setServerError("");

    const result = createTodoSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: TodoFieldErrors = { ...initialErrors };

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof TodoFieldErrors;

        if (field in fieldErrors && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    const dueDate = data.due_date;

    if (dueDate instanceof Date && dueDate.getTime() <= Date.now()) {
      setErrors((prev) => ({
        ...prev,
        due_date: "Choose a future date and time.",
      }));
      setIsDatePickerOpen(true);
      return;
    }

    // Don't send null for an optional due date.
    // The backend can then treat an omitted due_date as no due date.
    const { due_date, ...todoFields } = result.data;

    const payload = {
      ...todoFields,
      ...(due_date ? { due_date } : {}),
    } as AddTodoType;

    mutate(payload, {
      onSuccess: () => {
        setAddTodo(false);
      },
      onError: (err) => {
        const message = err.response?.data?.message;

        setServerError(
          typeof message === "string"
            ? message
            : "Unable to create your task. Please try again.",
        );
      },
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setAddTodo(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-todo-title"
        className="my-auto w-full max-w-2xl overflow-visible rounded-2xl border border-border bg-surface shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Plus size={20} />
            </div>

            <div>
              <h2
                id="add-todo-title"
                className="text-lg font-semibold text-text-primary"
              >
                Add a new task
              </h2>
              <p className="mt-0.5 text-sm text-text-secondary">
                Make a plan and get things done.
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

        {/* Body */}
        <div className="space-y-5 px-6 py-6">
          {serverError && (
            <div
              role="alert"
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400"
            >
              {serverError}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="todo-title"
              className="text-sm font-medium text-text-primary"
            >
              Task title
            </label>

            <input
              id="todo-title"
              name="title"
              type="text"
              autoFocus
              maxLength={100}
              value={data.title}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "todo-title-error" : undefined}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="What needs to be done?"
              className={`w-full rounded-xl border ${
                errors.title ? "border-rose-500" : "border-border"
              } bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-brand focus:ring-2 focus:ring-brand/10`}
            />

            {errors.title && (
              <p id="todo-title-error" className="text-sm text-rose-400">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="todo-description"
              className="flex items-center gap-2 text-sm font-medium text-text-primary"
            >
              <AlignLeft size={15} className="text-text-secondary" />
              Description
              <span className="font-normal text-text-secondary">
                (optional)
              </span>
            </label>

            <textarea
              id="todo-description"
              name="description"
              rows={3}
              value={data.description ?? ""}
              aria-invalid={Boolean(errors.description)}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Add some details about this task..."
              className={`w-full resize-none rounded-xl border ${
                errors.description ? "border-rose-500" : "border-border"
              } bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-brand focus:ring-2 focus:ring-brand/10`}
            />

            {errors.description && (
              <p className="text-sm text-rose-400">{errors.description}</p>
            )}
          </div>

          {/* Priority and due date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Priority */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <Flag size={15} className="text-text-secondary" />
                Priority
              </label>

              <div className="relative">
                <button
                  type="button"
                  aria-expanded={isPriorityOpen}
                  onClick={() => setIsPriorityOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm transition hover:border-brand/60"
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

              {errors.priority && (
                <p className="text-sm text-rose-400">{errors.priority}</p>
              )}
            </div>

            {/* Due date */}
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
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className={`flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border ${
                  errors.due_date ? "border-rose-500" : "border-border"
                } bg-background px-3 py-3 text-left text-sm transition hover:border-brand/60 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <span
                  className={`min-w-0 truncate ${
                    data.due_date ? "text-text-primary" : "text-text-secondary/70"
                  }`}
                >
                  {data.due_date
                    ? `${formattedDate} · ${formattedTime}`
                    : "No due date"}
                </span>

                <CalendarDays
                  size={16}
                  className="shrink-0 text-text-secondary"
                />
              </button>

            </div>
            </div>
              <TodoDateTimePicker
                isOpen={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
                value={data.due_date ?? null}
                onChange={(dueDate) => updateField("due_date", dueDate)}
                disabled={isPending}
                error={errors.due_date}
                setFormattedDate={setFormattedDate}
                setFormattedTime = {setFormattedTime}
              />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 rounded-b-2xl border-t border-border bg-background/50 px-6 py-4">
          <button
            type="button"
            disabled={isPending}
            onClick={handleClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-background hover:text-text-primary disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              "Adding..."
            ) : (
              <>
                <Plus size={16} />
                Add task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTodoModal;
