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
import { type AddTodoType } from "../../../../shared/schemas/todos.schema";

type Priority = "low" | "medium" | "high";

const priorityOptions: {
  value: Priority;
  label: string;
  dot: string;
}[] = [
  { value: "low", label: "Low", dot: "bg-emerald-400" },
  { value: "medium", label: "Medium", dot: "bg-amber-400" },
  { value: "high", label: "High", dot: "bg-rose-400" },
];

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

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
  setAddTodo: (arg0: boolean) => void;
}) => {
  const [priority, setPriority] = useState<Priority>("medium");
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [selectedHour, setSelectedHour] = useState("09");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const [data, setData] = useState<AddTodoType>({
    title: "",
    description: "",
    priority: "low",
    due_date: null,
  });

  const updateDueDate = (date: Date, hour: string, minute: string) => {
    const dueDate = new Date(date);

    dueDate.setHours(Number(hour), Number(minute), 0, 0);

    setData((prev) => ({
      ...prev,
      due_date: dueDate,
    }));
  };
  const currentPriority = priorityOptions.find(
    (option) => option.value === priority,
  )!;

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

  // Convert the selected 24-hour time into a readable 12-hour time.
  const hour24 = Number(selectedHour);
  const hour12 = hour24 % 12 || 12;
  const period = hour24 >= 12 ? "PM" : "AM";

  const formattedTime = `${hour12}:${selectedMinute} ${period}`;

  // Display the selected date AND time in the date-picker button.
  const formattedDateTime = selectedDate
    ? `${formattedDate} · ${formattedTime}`
    : `${formattedDate} · ${formattedTime}`;

  const changeMonth = (amount: number) => {
    setCalendarMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1),
    );
  };

  const selectDate = (day: number) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    updateDueDate(date, selectedHour, selectedMinute);
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

  console.log(data);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-2xl overflow-visible rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Plus size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text-primary">
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
            onClick={() => setAddTodo(false)}
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal body */}
        <div className="space-y-5 px-6 py-6">
          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="todo-title"
              className="text-sm font-medium text-text-primary"
            >
              Task title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="What needs to be done?"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-brand focus:ring-2 focus:ring-brand/10"
            />
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
              id="description"
              name="description"
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              placeholder="Add some details about this task..."
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-brand focus:ring-2 focus:ring-brand/10"
            />
          </div>

          {/* Priority and due date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Custom priority dropdown */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <Flag size={15} className="text-text-secondary" />
                Priority
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPriorityOpen((prev) => !prev)}
                  aria-expanded={isPriorityOpen}
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
                          setData((prev) => ({
                            ...prev,
                            priority: option.value,
                          }));
                          setPriority(option.value)
                          setIsPriorityOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                          priority === option.value
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

                        {priority === option.value && (
                          <span className="text-xs">Selected</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Date and time trigger */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <CalendarDays size={15} className="text-text-secondary" />
                Due date & time
              </label>

              <button
                type="button"
                onClick={() => setIsDatePickerOpen((prev) => !prev)}
                aria-expanded={isDatePickerOpen}
                className="flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-3 text-left text-sm transition hover:border-brand/60"
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
            </div>
          </div>

          {/* Custom calendar and time picker */}
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

                  {/* Weekday headings and calendar dates */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <div
                        key={day}
                        className="py-2 text-xs font-medium text-text-secondary"
                      >
                        {day}
                      </div>
                    ))}

                    {calendarDays.map((day, index) =>
                      day === null ? (
                        <div key={`empty-${index}`} />
                      ) : (
                        <button
                          key={day}
                          type="button"
                          aria-pressed={Boolean(isSelectedDay(day))}
                          onClick={() => selectDate(day)}
                          className={`mx-auto flex size-8 items-center justify-center rounded-lg text-sm transition sm:size-9 ${
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
                      onSelect={setSelectedHour}
                    />

                    <span className="font-semibold text-text-secondary">:</span>

                    <CustomTimeSelect
                      label="Select minutes"
                      value={selectedMinute}
                      options={minutes}
                      onSelect={setSelectedMinute}
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

        {/* Modal footer */}
        <div className="flex justify-end gap-3 rounded-b-2xl border-t border-border bg-background/50 px-6 py-4">
          <button
            onClick={() => setAddTodo(false)}
            type="button"
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-background hover:text-text-primary"
          >
            Cancel
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
          >
            <Plus size={16} />
            Add task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTodoModal;
