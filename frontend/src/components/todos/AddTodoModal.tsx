
import { useState } from "react";
import {
  AlignLeft,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  Plus,
  X,
} from "lucide-react";

import {
  createTodoSchema,
  type AddTodoType,
} from "../../../../shared/schemas/todos.schema";
import { useAddTodo } from "../../hooks/todos/useAddTodo";

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

const hours = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0"),
);

const minutes = ["00", "15", "30", "45"];

type CustomTimeSelectProps = {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  label: string;
};

function CustomTimeSelect({
  value,
  options,
  onSelect,
  label,
}: CustomTimeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex min-w-20 items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary transition hover:border-brand/60"
      >
        <span>{value}</span>
        <ChevronDown
          size={14}
          className={`text-text-secondary transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="no-scroll absolute bottom-full left-0 z-30 mb-2 max-h-40 w-full overflow-y-auto rounded-xl border border-border bg-surface p-1 shadow-xl">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className={`w-full rounded-md px-3 py-2 text-center text-sm transition ${
                option === value
                  ? "bg-brand/10 text-brand"
                  : "text-text-secondary hover:bg-background hover:text-text-primary"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const AddTodoModal = ({
  setAddTodo,
}: {
  setAddTodo: (open: boolean) => void;
}) => {
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState("09");
  const [selectedMinute, setSelectedMinute] = useState("00");

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

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDays: (number | null)[] = [
    ...Array.from({ length: firstDayOfMonth }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Choose a date";

  const hour24 = Number(selectedHour);
  const hour12 = hour24 % 12 || 12;
  const period = hour24 >= 12 ? "PM" : "AM";
  const formattedTime = `${hour12}:${selectedMinute} ${period}`;

  const formattedDateTime = selectedDate
    ? `${formattedDate} · ${formattedTime}`
    : "No due date";

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

  const updateDueDate = (
    date: Date,
    hour: string,
    minute: string,
  ) => {
    const dueDate = new Date(date);
    dueDate.setHours(Number(hour), Number(minute), 0, 0);

    updateField("due_date", dueDate);
    setSelectedDate(new Date(date));
  };

  const changeMonth = (amount: number) => {
    setCalendarMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + amount,
          1,
        ),
    );
  };

  const selectDate = (day: number) => {
    const date = new Date(year, month, day);
    updateDueDate(date, selectedHour, selectedMinute);
  };

  const handleHourChange = (hour: string) => {
    setSelectedHour(hour);

    if (selectedDate) {
      updateDueDate(selectedDate, hour, selectedMinute);
    }
  };

  const handleMinuteChange = (minute: string) => {
    setSelectedMinute(minute);

    if (selectedDate) {
      updateDueDate(selectedDate, selectedHour, minute);
    }
  };

  const clearDueDate = () => {
    setSelectedDate(null);
    updateField("due_date", null);
    setIsDatePickerOpen(false);
  };

  const isSelectedDay = (day: number) =>
    selectedDate?.getFullYear() === year &&
    selectedDate?.getMonth() === month &&
    selectedDate?.getDate() === day;

  const isToday = (day: number) => {
    const today = new Date();

    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const isPastDate = (day: number) => {
    const candidate = new Date(year, month, day);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return candidate < today;
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

    if (
      dueDate instanceof Date &&
      dueDate.getTime() <= Date.now()
    ) {
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
              <p className="text-sm text-rose-400">
                {errors.description}
              </p>
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
                aria-expanded={isDatePickerOpen}
                onClick={() => setIsDatePickerOpen((prev) => !prev)}
                className={`flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border ${
                  errors.due_date ? "border-rose-500" : "border-border"
                } bg-background px-3 py-3 text-left text-sm transition hover:border-brand/60`}
              >
                <span
                  className={`min-w-0 truncate ${
                    selectedDate
                      ? "text-text-primary"
                      : "text-text-secondary/70"
                  }`}
                >
                  {formattedDateTime}
                </span>

                <CalendarDays
                  size={16}
                  className="shrink-0 text-text-secondary"
                />
              </button>

              {errors.due_date && (
                <p className="text-sm text-rose-400">{errors.due_date}</p>
              )}
            </div>
          </div>

          {/* Calendar and time picker */}
          {isDatePickerOpen && (
            <div className="relative rounded-2xl border border-border bg-background p-4">
              <button
                type="button"
                aria-label="Close date and time picker"
                onClick={() => setIsDatePickerOpen(false)}
                className="absolute right-3 top-3 z-10 rounded-lg p-2 text-text-secondary transition hover:bg-surface hover:text-text-primary"
              >
                <X size={16} />
              </button>

              <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
                {/* Calendar */}
                <div className="min-w-0">
                  <div className="mb-4 flex items-center justify-between gap-1 pr-9 sm:pr-0">
                    <button
                      type="button"
                      aria-label="Previous month"
                      onClick={() => changeMonth(-1)}
                      className="rounded-lg p-2 text-text-secondary transition hover:bg-surface hover:text-text-primary"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <h3 className="text-center text-sm font-semibold text-text-primary">
                      {calendarMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>

                    <button
                      type="button"
                      aria-label="Next month"
                      onClick={() => changeMonth(1)}
                      className="rounded-lg p-2 text-text-secondary transition hover:bg-surface hover:text-text-primary"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                      (day) => (
                        <div
                          key={day}
                          className="py-2 text-xs font-medium text-text-secondary"
                        >
                          {day}
                        </div>
                      ),
                    )}

                    {calendarDays.map((day, index) =>
                      day === null ? (
                        <div key={`empty-${index}`} />
                      ) : (
                        <button
                          key={day}
                          type="button"
                          disabled={isPastDate(day)}
                          aria-pressed={Boolean(isSelectedDay(day))}
                          onClick={() => selectDate(day)}
                          className={`mx-auto flex size-8 items-center justify-center rounded-lg text-sm transition disabled:cursor-not-allowed disabled:opacity-30 sm:size-9 ${
                            isSelectedDay(day)
                              ? "bg-brand text-white"
                              : isToday(day)
                                ? "border border-brand/60 text-brand"
                                : "text-text-primary hover:bg-surface"
                          }`}
                        >
                          {day}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Time picker */}
                <div className="flex min-w-0 flex-col items-center justify-center border-t border-border pt-5 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                  <div className="mb-4 flex items-center justify-center gap-2 text-sm font-medium text-text-primary">
                    <Clock3 size={16} className="text-brand" />
                    Select time
                  </div>

                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <CustomTimeSelect
                      label="Select hour"
                      value={selectedHour}
                      options={hours}
                      onSelect={handleHourChange}
                    />

                    <span className="font-semibold text-text-secondary">
                      :
                    </span>

                    <CustomTimeSelect
                      label="Select minutes"
                      value={selectedMinute}
                      options={minutes}
                      onSelect={handleMinuteChange}
                    />

                    <span className="text-xs font-medium text-text-secondary">
                      {period}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-text-secondary">
                    Selected time:{" "}
                    <span className="font-medium text-text-primary">
                      {formattedTime}
                    </span>
                  </p>

                  {selectedDate && (
                    <button
                      type="button"
                      onClick={clearDueDate}
                      className="mt-3 text-sm text-rose-400 transition hover:text-rose-300"
                    >
                      Remove due date
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDatePickerOpen(false)}
                className="mt-5 w-full rounded-lg bg-brand/10 px-4 py-2.5 text-sm font-medium text-brand transition hover:bg-brand/20"
              >
                Done
              </button>
            </div>
          )}
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
