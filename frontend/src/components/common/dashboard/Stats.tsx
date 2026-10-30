import { ArrowUpRight, CheckCircle2, Clock3, ListTodo, MoveRight, Target } from "lucide-react";
import { NavLink } from "react-router-dom";

type StatsType = {
    totalTodos: number;
    totalPending: number;
    totalCompleted: number;
    totalOverdue: number
}

const Stats = ({totalTodos, totalPending, totalCompleted, totalOverdue}: StatsType) => {
  const stats = [
    {
      label: "Total Tasks",
      value: totalTodos,
      icon: ListTodo,
      description: "Open my tasks",
      path: "/tasks",
      pathName: "tasks",
    },
    {
      label: "In Progress",
      value: totalPending,
      icon: Clock3,
      description: "Tasks to focus on",
      path: "/tasks?status=pending",
      pathName: "pending",
    },
    {
      label: "Completed",
      value: totalCompleted,
      icon: CheckCircle2,
      description: "Great progress",
      path: "/tasks?status=completed",
      pathName: "completed",
    },
    {
      label: "Overdue",
      value: totalOverdue,
      icon: Target,
      description:
        totalOverdue > 0 ? "Need your attention" : "You're all caught up",
      path: "/tasks?status=overdue",
      pathName: "overdue",
    },
  ];
  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const statStyleDesc =
            stat.pathName === "tasks"
              ? "text-brand-hover"
              : stat.pathName === "pending"
                ? "text-brand"
                : stat.pathName === "completed"
                  ? "text-green-500"
                  : stat.pathName === "overdue" && stat.value > 0
                    ? "text-red-500"
                    : "text-green-500";
          const statStyleBg =
            stat.pathName === "tasks"
              ? "bg-brand-hover/10"
              : stat.pathName === "pending"
                ? "bg-brand/10"
                : stat.pathName === "completed"
                  ? "bg-green-500/10"
                  : stat.pathName === "overdue" && stat.value > 0
                    ? "bg-red-500/10"
                    : "bg-green-500/10";
          const statStyleCard =
            stat.pathName === "tasks"
              ? "hover:border-brand-hover"
              : stat.pathName === "pending"
                ? "hover:border-brand"
                : stat.pathName === "completed"
                  ? "hover:border-green-500"
                  : stat.pathName === "overdue" && stat.value > 0
                    ? "hover:border-red-500"
                    : "hover:border-green-500";

          return (
            <NavLink
              to={stat.path}
              key={stat.label}
              className={`rounded-card border border-border bg-surface p-5 group transition-all duration-200 ${statStyleCard}`}
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-button ${statStyleBg} ${statStyleDesc}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-text-muted" />
              </div>

              <div className="mt-5">
                <p className="text-2xl font-bold tracking-tight">
                  {stat.value.toString().padStart(2, "0")}
                </p>
                <p className="mt-1 text-sm font-medium text-text-primary/60">
                  {stat.label}
                </p>
                <p
                  className={`mt-1 text-xs flex items-center gap-2  ${statStyleDesc}`}
                >
                  {stat.description}{" "}
                  <span className="group-hover:pl-2 transition-all duration-200">
                    <MoveRight />
                  </span>
                </p>
              </div>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default Stats;
