
import { useSearchParams } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock3, GoalIcon, ListTodo } from "lucide-react";
import { useAllTodos } from "../hooks/todos/useAllTodos";
import TodoUI from "../components/todos/TodoUI";
const taskViews = {
  all: {
    title: "All Tasks",
    description: "Manage all your tasks in one place.",
    icon: ListTodo,
  },
  pending: {
    title: "Pending Tasks",
    description: "Tasks that still need your attention.",
    icon: Clock3,
  },
  completed: {
    title: "Completed Tasks",
    description: "Look at everything you've accomplished.",
    icon: CheckCircle2,
  },
  today: {
    title: "Today's Tasks",
    description: "Tasks scheduled for today.",
    icon: CalendarDays,
  },
  upcoming: {
    title: "Upcoming Tasks",
    description: "Tasks scheduled for the days ahead.",
    icon: CalendarDays,
  },
  overdue: {
    title: "Overdue Tasks",
    description: "Tasks that due date is expire",
    icon: GoalIcon,
  },
} as const;

type TaskStatus = keyof typeof taskViews;

const TasksPage = () => {
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status");

  const isValidStatus =
    statusParam === null ||
    Object.prototype.hasOwnProperty.call(taskViews, statusParam);

  const status = isValidStatus
    ? ((statusParam ?? "all") as TaskStatus)
    : null;

  const { data, isLoading, isError, error } = useAllTodos(
    status === "all" ? undefined : status ?? statusParam ?? undefined,
  );

  if (!isValidStatus) {
    return (
      <section className="p-6">
        <h1 className="text-xl font-semibold text-text-primary">
          Invalid task filter
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Choose all, pending, completed, today, or upcoming.
        </p>
      </section>
    );
  }

  const view = taskViews[status ?? "all"];
  const Icon = view.icon;
  const todos = data?.data ?? [];
  const totalTodos = data?.meta.totalTodos ?? 0;

  return (
    <main className="mx-auto w-full p-4 sm:p-6 max-w-7xl lg:p-8 lg:ml-64">
      {/* Page heading */}
      <header className="mb-8 flex items-start gap-4">
        <div className="rounded-xl bg-brand/10 p-3 text-brand">
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-text-primary">
            {view.title}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {view.description}
          </p>
        </div>

        {!isLoading && !isError && (
          <span className="shrink-0 rounded-full border border-border px-3 py-1 text-sm text-text-secondary">
            {totalTodos} {totalTodos === 1 ? "task" : "tasks"}
          </span>
        )}
      </header>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3" aria-live="polite">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-xl border border-border bg-surface"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-error/30 bg-error/5 p-5"
        >
          <h2 className="font-semibold text-text-primary">
            Couldn't load your tasks
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            {error instanceof Error
              ? error.message
              : "Something went wrong. Please try again."}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && todos.length === 0 && (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-12 text-center">
          <div className="mb-4 rounded-full bg-surface p-4 text-text-muted">
            <Icon className="h-7 w-7" />
          </div>

          <h2 className="text-lg font-semibold text-text-primary">
            {status === "completed"
              ? "No completed tasks yet"
              : status === "pending"
                ? "You're all caught up!"
                : status === "today"
                  ? "Nothing scheduled for today"
                  : status === "upcoming"
                    ? "No upcoming tasks"
                    : "No tasks yet"}
          </h2>

          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            {status === "all"
              ? "Create your first task and it will appear here."
              : "Tasks matching this view will appear here when available."}
          </p>
        </div>
      )}

      {/* Task list */}
      {!isLoading && !isError && todos.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-border bg-surface">
          {todos.map((todo) => (
            <div key={todo.id} className="border-b border-border last:border-b-0">
              <TodoUI todo={todo} />
            </div>
          ))}
        </section>
      )}
    </main>
  );
};

export default TasksPage;
