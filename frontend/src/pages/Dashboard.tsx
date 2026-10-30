import { CheckCircle2, Plus } from "lucide-react";

import { useAllTodos } from "../hooks/todos/useAllTodos";
import Loading from "../components/common/states/Loading";
import ErrorState from "../components/common/states/ErrorState";
import { Fragment, useState } from "react";
import AddTodoModal from "../components/todos/AddTodoModal";
import TodoUI from "../components/todos/TodoUI";
import type { TodoTypeFrontend } from "../types/todos/todo.type";
import Stats from "../components/common/dashboard/Stats";
import ProductivityBar from "../components/common/dashboard/ProductivityBar";
import UpcomingTasksCard from "../components/common/dashboard/UpcomingTasksCard";

const Dashboard = () => {
  const [addTodo, setAddTodo] = useState<boolean>(false);
  const {
    data: todosResponse,
    isPending: isTodosPending,
    isError: isTodosError,
    error: todosError,
    refetch,
  } = useAllTodos();

  // Keep the page shell visible while data is loading.
  const todos: TodoTypeFrontend[] = todosResponse?.data ?? [];
  const now = new Date();
  const [tab, setTab] = useState<"all" | "pending">("all");

  const totalTodos = todosResponse?.meta?.totalTodos ?? todos.length;
  const totalCompleted = todos.filter(
    (todo: TodoTypeFrontend) => todo.completed,
  ).length;
  const totalPending = todos.filter(
    (todo: TodoTypeFrontend) => !todo.completed,
  ).length;
  const totalPendingToday = todos.reduce(
    (acc: number, task: TodoTypeFrontend) =>
      !task.completed &&
      new Date(task.due_date).toDateString() === now.toDateString()
        ? acc + 1
        : acc,
    0,
  );
  const totalOverdue = todos.filter((todo: TodoTypeFrontend) =>
    todo.due_date
      ? !todo.completed && new Date(todo.due_date).getTime() < now.getTime()
      : null,
  ).length;

  const todayPendingTasks = todos
    .filter((todo: TodoTypeFrontend) => {
      const dueDate = new Date(todo.due_date);
      return dueDate.toDateString() === now.toDateString();
    })
    .sort((a, b) => Number(a.completed) - Number(b.completed));

  return (
    <section className="min-h-screen bg-background text-text-primary lg:ml-64">
      <div className="flex min-h-screen">
        {/* Sidebar */}

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 ">
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
                  <Stats
                    totalTodos={totalTodos}
                    totalCompleted={totalCompleted}
                    totalPending={totalPending}
                    totalOverdue={totalOverdue}
                  />

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
                        {todayPendingTasks
                          .splice(0, 5)
                          .map((task: TodoTypeFrontend) => (
                            <Fragment key={task.id}>
                              {tab === "all" ? (
                                <>
                                  <TodoUI todo={task} />
                                </>
                              ) : (
                                <></>
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
                    <UpcomingTasksCard todos={todos} />

                    <ProductivityBar
                      totalCompleted={totalCompleted}
                      totalTodos={totalTodos}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {addTodo && <AddTodoModal setAddTodo={setAddTodo} />}
    </section>
  );
};

export default Dashboard;
