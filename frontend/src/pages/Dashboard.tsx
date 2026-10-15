import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
  MoreHorizontal,
  Plus,
  Target,
  User,
} from "lucide-react";

import { useCurrentUser } from "../hooks/auth/useCurrentUser";
import { useAllTodos } from "../hooks/todos/useAllTodos";
import Loading from "../components/common/states/Loading";
import ErrorState from "../components/common/states/ErrorState";
import { Fragment, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Header from "../components/layout/Header";
import AddTodoModal from "../components/todos/AddTodoModal";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  const { data: currentUser, isPending: isUserPending } = useCurrentUser();
  const [addTodo, setAddTodo] = useState<boolean>(false)
  const {
    data: todosResponse,
    isPending: isTodosPending,
    isError: isTodosError,
    error: todosError,
    refetch,
  } = useAllTodos();

  // Keep the page shell visible while data is loading.
  const todos = todosResponse?.data ?? [];
  const now = new Date();
  const [tab, setTab] = useState<"all" | "pending">("all");

  const totalTodos = todosResponse?.meta?.totalTodos ?? todos.length;
  const totalCompleted = todos.filter((todo) => todo.completed).length;
  const totalPending = todos.filter((todo) => !todo.completed).length;
  const totalPendingToday = todos.reduce(
    (acc, task) =>
      !task.completed &&
      new Date(task.due_date).toDateString() === now.toDateString()
        ? acc + 1
        : acc,
    0,
  );
  const totalOverdue = todos.filter(
    (todo) =>
      !todo.completed && new Date(todo.due_date).getTime() < now.getTime(),
  ).length;

  const todayPendingTasks = todos.filter((todo) => {
    const dueDate = new Date(todo.due_date);

    return dueDate.toDateString() === now.toDateString();
  });

  const upcomingTasks = todos
    .filter(
      (todo) =>
        !todo.completed &&
        new Date(todo.due_date).getTime() > now.getTime() &&
        new Date(todo.due_date).toDateString() !== now.toDateString(),
    )
    .sort(
      (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    )
    .slice(0, 3);

  const completionRate =
    totalTodos > 0 ? Math.round((totalCompleted / totalTodos) * 100) : 0;

  const stats = [
    {
      label: "Total Tasks",
      value: totalTodos,
      icon: ListTodo,
      description: "All your tasks",
    },
    {
      label: "In Progress",
      value: totalPending,
      icon: Clock3,
      description: "Tasks to focus on",
    },
    {
      label: "Completed",
      value: totalCompleted,
      icon: CheckCircle2,
      description: "Great progress",
    },
    {
      label: "Overdue",
      value: totalOverdue,
      icon: Target,
      description:
        totalOverdue > 0 ? "Need your attention" : "You're all caught up",
    },
  ];

  const firstName = currentUser?.name?.trim().split(/\s+/)[0] || "there";

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="fixed hidden h-full w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
          <div className="flex h-20 items-center gap-3 border-b border-border px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-button bg-brand font-bold text-background">
              T
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Todo<span className="text-brand">App</span>
            </span>
          </div>

          <Navbar />

          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-button p-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                {isUserPending ? (
                  <>
                    <div className="h-3 w-24 animate-pulse rounded bg-border" />
                    <div className="mt-2 h-2.5 w-32 animate-pulse rounded bg-border" />
                  </>
                ) : (
                  <>
                    <p className="truncate text-sm font-medium text-text-primary">
                      {currentUser?.name || "Your account"}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      {currentUser?.email || "Account details unavailable"}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
          {/* Header */}
          <Header
            getGreeting={getGreeting}
            formatDate={formatDate}
            firstName={firstName}
            now={now}
          />
          <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-7xl">
              {/* Page heading */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-medium text-brand">Overview</p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight">
                    Your productivity at a glance
                  </h2>
                  <p className="mt-2 text-sm text-text-secondary">
                    Here's what's happening with your tasks today.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAddTodo(true)}
                  className="flex items-center justify-center gap-2 rounded-button bg-brand px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-brand-hover"
                >
                  <Plus className="h-4 w-4" />
                  Add task
                </button>
              </div>

              {/* API loading and error states stay within the page layout */}
              {isTodosPending ? (
                <div className="mt-8 rounded-card border border-border bg-surface p-6">
                  <Loading message="Loading your tasks..." />
                </div>
              ) : isTodosError ? (
                <div className="mt-8 rounded-card border border-border bg-surface p-6">
                  <ErrorState
                    message={
                      todosError instanceof Error
                        ? todosError.message
                        : "We couldn't load your tasks."
                    }
                    onRetry={() => void refetch()}
                  />
                </div>
              ) : (
                <>
                  {/* Stats */}
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                      const Icon = stat.icon;

                      return (
                        <div
                          key={stat.label}
                          className="rounded-card border border-border bg-surface p-5 transition hover:border-border-hover"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-button bg-brand/10 text-brand">
                              <Icon className="h-5 w-5" />
                            </div>
                            <MoreHorizontal className="h-5 w-5 text-text-muted" />
                          </div>

                          <div className="mt-5">
                            <p className="text-2xl font-bold tracking-tight">
                              {stat.value.toString().padStart(2, "0")}
                            </p>
                            <p className="mt-1 text-sm font-medium text-text-primary">
                              {stat.label}
                            </p>
                            <p className="mt-1 text-xs text-text-muted">
                              {stat.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Today's tasks */}
                  <section className="mt-8 rounded-card border border-border bg-surface">
                    <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold">Today's tasks</h3>
                        {tab === "all" ? (
                          <p className="mt-1 text-xs text-text-muted">
                            {todayPendingTasks.length > 0
                              ? `${todayPendingTasks.length} ${todayPendingTasks.length === 1 ? "task" : "tasks"}`
                              : "Nothing due today"}
                          </p>
                        ) : (
                          <>
                            <p className="mt-1 text-xs text-text-muted">
                              {todayPendingTasks.length > 0
                                ? `${totalPendingToday} Pending ${totalPendingToday === 1 ? "task" : "tasks"}`
                                : "Nothing due today"}
                            </p>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTab("all")}
                          type="button"
                          className={`rounded-button border border-border px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-border-hover hover:text-text-primary ${tab === "all" ? "bg-brand text-white" : ""}`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setTab("pending")}
                          type="button"
                          className={`rounded-button border border-border px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-border-hover hover:text-text-primary ${tab === "pending" ? "bg-brand text-white" : ""}`}
                        >
                          Pending
                        </button>
                      </div>
                    </div>

                    {todayPendingTasks.length > 0 ? (
                      <div className="divide-y divide-border">
                        {todayPendingTasks.splice(0, 5).map((task) => (
                          <Fragment key={task.id}>
                            {tab === "all" ? (
                              <>
                                {!task.completed && (
                                  <div
                                    className="group flex items-start gap-4 p-5 transition hover:bg-background/50"
                                  >
                                    <button
                                      type="button"
                                      aria-label={`Mark ${task.title} as complete`}
                                      className="mt-0.5 shrink-0 text-text-muted transition hover:text-brand"
                                    >
                                      <Circle className="h-5 w-5" />
                                    </button>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <h4 className="text-sm font-medium text-text-primary">
                                          {task.title}
                                        </h4>
                                        <span
                                          className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                            task.priority === "high"
                                              ? "bg-error/10 text-error"
                                              : task.priority === "medium"
                                                ? "bg-warning/10 text-warning"
                                                : "bg-success/10 text-success"
                                          }`}
                                        >
                                          {task.priority}
                                        </span>
                                      </div>

                                      {task.description && (
                                        <p className="mt-1 line-clamp-2 text-xs text-text-muted">
                                          {task.description}
                                        </p>
                                      )}

                                      <div className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        Due{" "}
                                        {new Date(
                                          task.due_date,
                                        ).toLocaleString()}
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      aria-label={`More options for ${task.title}`}
                                      className="shrink-0 text-text-muted transition hover:text-text-primary sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                                    >
                                      <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                  </div>
                                )}
                                {task.completed && (
                                  <div
                                    className="group flex items-start gap-4 p-5 transition hover:bg-background/50"
                                  >
                                    <button
                                      type="button"
                                      aria-label={`Mark ${task.title} as complete`}
                                      className="mt-0.5 shrink-0 text-brand transition hover:text-brand"
                                    >
                                      <Circle
                                        className="h-5 w-5 "
                                        fill="currentColor"
                                      />
                                    </button>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <h4 className="text-sm font-medium text-text-primary/40 line-through">
                                          {task.title}
                                        </h4>
                                        <span
                                          className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                            task.priority === "high"
                                              ? "bg-error/10 text-error/40"
                                              : task.priority === "medium"
                                                ? "bg-warning/10 text-warning/40"
                                                : "bg-success/10 text-success/40"
                                          }`}
                                        >
                                          {task.priority}
                                        </span>
                                      </div>

                                      {task.description && (
                                        <p className="mt-1 line-clamp-2 text-xs text-text-muted">
                                          {task.description}
                                        </p>
                                      )}

                                      <div className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        Due{" "}
                                        {new Date(
                                          task.due_date,
                                        ).toLocaleString()}
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      aria-label={`More options for ${task.title}`}
                                      className="shrink-0 text-text-muted transition hover:text-text-primary sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                                    >
                                      <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                {!task.completed && (
                                  <div
                                    className="group flex items-start gap-4 p-5 transition hover:bg-background/50"
                                  >
                                    <button
                                      type="button"
                                      aria-label={`Mark ${task.title} as complete`}
                                      className="mt-0.5 shrink-0 text-text-muted transition hover:text-brand"
                                    >
                                      <Circle className="h-5 w-5" />
                                    </button>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <h4 className="text-sm font-medium text-text-primary">
                                          {task.title}
                                        </h4>
                                        <span
                                          className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                            task.priority === "high"
                                              ? "bg-error/10 text-error"
                                              : task.priority === "medium"
                                                ? "bg-warning/10 text-warning"
                                                : "bg-success/10 text-success"
                                          }`}
                                        >
                                          {task.priority}
                                        </span>
                                      </div>

                                      {task.description && (
                                        <p className="mt-1 line-clamp-2 text-xs text-text-muted">
                                          {task.description}
                                        </p>
                                      )}

                                      <div className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        Due{" "}
                                        {new Date(
                                          task.due_date,
                                        ).toLocaleString()}
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      aria-label={`More options for ${task.title}`}
                                      className="shrink-0 text-text-muted transition hover:text-text-primary sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                                    >
                                      <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </Fragment>
                        ))}
                        {todayPendingTasks.length > 5 && (
                          <div className="border-t border-border p-4 text-center">
                            <button
                              type="button"
                              className="text-sm font-medium text-brand transition hover:text-brand-hover"
                            >
                              View all tasks
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center px-6 py-10 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <h4 className="mt-3 text-sm font-semibold">
                          You're all caught up!
                        </h4>
                        <p className="mt-1 max-w-sm text-sm text-text-muted">
                          No pending tasks are due today. Enjoy the breathing
                          room or add a task when you're ready.
                        </p>
                      </div>
                    )}
                  </section>

                  {/* Upcoming and productivity */}
                  <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <section className="rounded-card border border-border bg-surface p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Upcoming</h3>
                          <p className="mt-1 text-xs text-text-muted">
                            Your next tasks
                          </p>
                        </div>
                        <Clock3 className="h-5 w-5 text-brand" />
                      </div>

                      {upcomingTasks.length > 0 ? (
                        <div className="mt-5 space-y-3">
                          {upcomingTasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between gap-4 rounded-button border border-border bg-background px-4 py-3"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <Circle className="h-4 w-4 shrink-0 text-text-muted" />
                                <span className="truncate text-sm text-text-secondary">
                                  {task.title}
                                </span>
                              </div>
                              <span className="ml-3 shrink-0 text-xs text-text-muted">
                                {new Date(task.due_date).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-5 rounded-button border border-dashed border-border px-4 py-8 text-center">
                          <p className="text-sm font-medium text-text-secondary">
                            Nothing coming up yet
                          </p>
                          <p className="mt-1 text-xs text-text-muted">
                            Future-dated pending tasks will appear here.
                          </p>
                        </div>
                      )}
                    </section>

                    <section className="rounded-card border border-border bg-surface p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Productivity</h3>
                          <p className="mt-1 text-xs text-text-muted">
                            Your overall task completion
                          </p>
                        </div>
                        <Target className="h-5 w-5 text-brand" />
                      </div>

                      <div className="mt-6">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-3xl font-bold">
                              {completionRate}%
                            </p>
                            <p className="mt-1 text-xs text-text-muted">
                              Completion rate
                            </p>
                          </div>
                          <span className="text-sm font-medium text-text-secondary">
                            {totalCompleted} of {totalTodos} tasks
                          </span>
                        </div>

                        <div
                          className="mt-5 h-2 overflow-hidden rounded-full bg-border"
                          role="progressbar"
                          aria-label="Task completion rate"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={completionRate}
                        >
                          <div
                            className="h-full rounded-full bg-brand transition-all"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>

                        <div className="mt-3 flex justify-between text-xs text-text-muted">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </section>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {addTodo && <AddTodoModal setAddTodo={setAddTodo}/>}
   
    </main>
  );
};

export default Dashboard;
