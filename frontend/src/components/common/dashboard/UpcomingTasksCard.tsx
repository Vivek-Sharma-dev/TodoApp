import { Circle, Clock3 } from "lucide-react";
import type { TodoTypeFrontend } from "../../../types/todos/todo.type";

const UpcomingTasksCard = ({ todos }: {todos: TodoTypeFrontend[]}) => {
    const now = new Date();
  const upcomingTasks: TodoTypeFrontend[] = todos
    .filter(
      (todo: TodoTypeFrontend) =>
        !todo.completed &&
        new Date(todo.due_date).getTime() > now.getTime() &&
        new Date(todo.due_date).toDateString() !== now.toDateString(),
    )
    .sort(
      (a: TodoTypeFrontend, b: TodoTypeFrontend) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    )
    .slice(0, 3);
  return (
    <>
      <section className="rounded-card border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Upcoming</h3>
            <p className="mt-1 text-xs text-text-muted">Your next tasks</p>
          </div>
          <Clock3 className="h-5 w-5 text-brand" />
        </div>

        {upcomingTasks.length > 0 ? (
          <div className="mt-5 space-y-3">
            {upcomingTasks.map((task: TodoTypeFrontend) => (
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
    </>
  );
};

export default UpcomingTasksCard;
