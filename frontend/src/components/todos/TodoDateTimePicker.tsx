import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  X,
} from "lucide-react";

type TodoDateTimePickerProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  error?: string;
  setFormattedDate: Dispatch<SetStateAction<string>>;
  setFormattedTime: Dispatch<SetStateAction<string>>;
};

const hours = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0"),
);

const minutes = ["00", "15", "30", "45"];

function TimeSelect({
  value,
  options,
  label,
  onSelect,
  disabled = false,
}: {
  value: string;
  options: string[];
  label: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;

      if (!event.target.closest("[data-time-select]")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative" data-time-select>
      <button
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex min-w-20 items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary transition hover:border-brand/60"
      >
        {value}
        <ChevronDown
          size={14}
          className={`text-text-secondary transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="no-scroll absolute bottom-full left-0 z-40 mb-2 max-h-40 w-full overflow-y-auto rounded-xl border border-border bg-surface p-1 shadow-xl">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              disabled={disabled}
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

const TodoDateTimePicker = ({
  isOpen: controlledIsOpen,
  onOpenChange,
  value,
  onChange,
  disabled = false,
  error,
  setFormattedDate,
  setFormattedTime,
}: TodoDateTimePickerProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? internalIsOpen;
  const setIsOpen = onOpenChange ?? setInternalIsOpen;

  const [calendarMonth, setCalendarMonth] = useState(() =>
    value
      ? new Date(value.getFullYear(), value.getMonth(), 1)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const [unselectedHour, setSelectedHour] = useState(() =>
    String(value?.getHours() ?? 9).padStart(2, "0"),
  );

  const [unselectedMinute, setSelectedMinute] = useState(() => {
    const minute = value?.getMinutes() ?? 0;
    return String(Math.floor(minute / 15) * 15).padStart(2, "0");
  });

  const selectedHour = String(value?.getHours() ?? unselectedHour).padStart(
    2,
    "0",
  );
  const selectedMinute = String(
    value ? Math.floor(value.getMinutes() / 15) * 15 : unselectedMinute,
  ).padStart(2, "0");

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDays: (number | null)[] = [
    ...Array.from({ length: firstDayOfMonth }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const hour24 = Number(selectedHour);
  const hour12 = hour24 % 12 || 12;
  const period = hour24 >= 12 ? "PM" : "AM";
  const formattedTime = `${hour12}:${selectedMinute} ${period}`;

  const formattedDate = value
    ? value.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Choose a date";

  setFormattedTime(formattedDate);
  setFormattedDate(formattedDate);
  const isSelectedDay = (day: number) =>
    value?.getFullYear() === year &&
    value?.getMonth() === month &&
    value?.getDate() === day;

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

  const changeMonth = (amount: number) => {
    setCalendarMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1),
    );
  };

  const selectDate = (day: number) => {
    const date = new Date(year, month, day);
    date.setHours(Number(selectedHour), Number(selectedMinute), 0, 0);
    onChange(date);
  };

  const changeTime = (hour: string, minute: string) => {
    if (!value) {
      setSelectedHour(hour);
      setSelectedMinute(minute);
      return;
    }

    const updatedDate = new Date(value);
    updatedDate.setHours(Number(hour), Number(minute), 0, 0);

    setSelectedHour(hour);
    setSelectedMinute(minute);
    onChange(updatedDate);
  };

  const clearDate = () => {
    onChange(null);
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen && (
        <div className="relative rounded-2xl border border-border bg-background p-4">
          <button
            type="button"
            aria-label="Close date and time picker"
            disabled={disabled}
            onClick={() => setIsOpen(false)}
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
                  disabled={disabled}
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
                  disabled={disabled}
                  onClick={() => changeMonth(1)}
                  className="rounded-lg p-2 text-text-secondary transition hover:bg-surface hover:text-text-primary"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

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
                      disabled={disabled || isPastDate(day)}
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
                <TimeSelect
                  label="Select hour"
                  value={selectedHour}
                  options={hours}
                  disabled={disabled}
                  onSelect={(hour) => changeTime(hour, selectedMinute)}
                />

                <span className="font-semibold text-text-secondary">:</span>

                <TimeSelect
                  label="Select minutes"
                  value={selectedMinute}
                  options={minutes}
                  disabled={disabled}
                  onSelect={(minute) => changeTime(selectedHour, minute)}
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

              {value && (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={clearDate}
                  className="mt-3 text-sm text-rose-400 transition hover:text-rose-300 disabled:opacity-50"
                >
                  Remove due date
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(false)}
            className="mt-5 w-full rounded-lg bg-brand/10 px-4 py-2.5 text-sm font-medium text-brand transition hover:bg-brand/20"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoDateTimePicker;
