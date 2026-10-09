import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  LayoutDashboard,
  ListTodo,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Target,
  User,
} from "lucide-react";
import { getAccessToken } from "../auth/tokenStore";

const Desktop = () => {
  const currentDate = new Date().toLocaleDateString();
  const stats = [
    {
      label: "Total Tasks",
      value: "24",
      icon: ListTodo,
      description: "All your tasks",
    },
    {
      label: "In Progress",
      value: "08",
      icon: Clock3,
      description: "Tasks to focus on",
    },
    {
      label: "Completed",
      value: "16",
      icon: CheckCircle2,
      description: "Great progress",
    },
    {
      label: "Overdue",
      value: "02",
      icon: Target,
      description: "Need your attention",
    },
  ];

  const tasks = [
    {
      id: 1,
      title: "Complete Todo App backend",
      description: "Finish authentication and todo APIs",
      priority: "High",
      due: "Today",
      completed: false,
    },
    {
      id: 2,
      title: "Build dashboard UI",
      description: "Create the first version of the desktop dashboard",
      priority: "Medium",
      due: "Today",
      completed: false,
    },
    {
      id: 3,
      title: "Study Java DSA",
      description: "Practice arrays and strings",
      priority: "Low",
      due: "Tomorrow",
      completed: false,
    },
    {
      id: 4,
      title: "Review project architecture",
      description: "Clean up authentication flow",
      priority: "Medium",
      due: "Oct 2",
      completed: true,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-text-primary">
      
      <div className="flex min-h-screen">
        {/* =====================================================
            SIDEBAR
        ===================================================== */}
        <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:flex lg:flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-border px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-button bg-brand font-bold text-background">
              T
            </div>

            <span className="text-lg font-semibold tracking-tight">
              Todo<span className="text-brand">App</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Workspace
            </p>

            <div className="space-y-1">
              <button className="flex w-full items-center gap-3 rounded-button bg-brand/10 px-3 py-2.5 text-sm font-medium text-brand">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>

              <button className="flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-sm text-text-secondary transition hover:bg-background hover:text-text-primary">
                <ListTodo className="h-4 w-4" />
                My Tasks
              </button>

              <button className="flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-sm text-text-secondary transition hover:bg-background hover:text-text-primary">
                <CalendarDays className="h-4 w-4" />
                Today
              </button>

              <button className="flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-sm text-text-secondary transition hover:bg-background hover:text-text-primary">
                <Clock3 className="h-4 w-4" />
                Upcoming
              </button>

              <button className="flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-sm text-text-secondary transition hover:bg-background hover:text-text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </button>
            </div>

            <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Preferences
            </p>

            <button className="flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-sm text-text-secondary transition hover:bg-background hover:text-text-primary">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </nav>

          {/* User */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-button p-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                <User className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">
                  Vivek Sharma
                </p>

                <p className="truncate text-xs text-text-muted">
                  vivek@example.com
                </p>
              </div>

              <ChevronDown className="h-4 w-4 text-text-muted" />
            </div>
          </div>
        </aside>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex h-20 items-center justify-between border-b border-border bg-background px-5 sm:px-8">
            <div>
              <p className="text-sm text-text-muted">Monday, September 29</p>

              <h1 className="mt-0.5 text-xl font-semibold tracking-tight">
                Good morning, Vivek 👋
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <button className="hidden h-10 items-center gap-2 rounded-button border border-border bg-surface px-3 text-sm text-text-muted transition hover:border-border-hover hover:text-text-secondary sm:flex">
                <Search className="h-4 w-4" />
                <span>Search tasks</span>
                <kbd className="ml-4 rounded border border-border px-1.5 py-0.5 text-[10px]">
                  /
                </kbd>
              </button>

              {/* Notification */}
              <button className="relative flex h-10 w-10 items-center justify-center rounded-button border border-border bg-surface text-text-secondary transition hover:border-border-hover hover:text-text-primary">
                <Bell className="h-4 w-4" />

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand" />
              </button>

              {/* Mobile profile */}
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand lg:hidden">
                <User className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Content */}
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

                <button className="flex items-center justify-center gap-2 rounded-button bg-brand px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-brand-hover">
                  <Plus className="h-4 w-4" />
                  Add task
                </button>
              </div>

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
                          {stat.value}
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

              {/* Tasks section */}
              <div className="mt-8 rounded-card border border-border bg-surface">
                {/* Task header */}
                <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">Today's tasks</h3>

                    <p className="mt-1 text-xs text-text-muted">
                      3 tasks remaining
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="rounded-button border border-border px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-border-hover hover:text-text-primary">
                      All
                    </button>

                    <button className="rounded-button border border-border px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-border-hover hover:text-text-primary">
                      Pending
                    </button>
                  </div>
                </div>

                {/* Tasks */}
                <div className="divide-y divide-border">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group flex items-start gap-4 p-5 transition hover:bg-background/50 ${
                        task.completed ? "opacity-60" : ""
                      }`}
                    >
                      {/* Complete button */}
                      <button
                        type="button"
                        className="mt-0.5 shrink-0 text-text-muted transition hover:text-brand"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-brand" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>

                      {/* Task information */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <h4
                            className={`text-sm font-medium ${
                              task.completed
                                ? "text-text-muted line-through"
                                : "text-text-primary"
                            }`}
                          >
                            {task.title}
                          </h4>

                          <span
                            className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              task.priority === "High"
                                ? "bg-error/10 text-error"
                                : task.priority === "Medium"
                                  ? "bg-warning/10 text-warning"
                                  : "bg-success/10 text-success"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-text-muted">
                          {task.description}
                        </p>

                        <div className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Due {task.due}
                        </div>
                      </div>

                      {/* More */}
                      <button
                        type="button"
                        className="shrink-0 text-text-muted opacity-0 transition hover:text-text-primary group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-border p-4 text-center">
                  <button className="text-sm font-medium text-brand transition hover:text-brand-hover">
                    View all tasks
                  </button>
                </div>
              </div>

              {/* Upcoming */}
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-card border border-border bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Upcoming</h3>

                      <p className="mt-1 text-xs text-text-muted">
                        Tasks coming next
                      </p>
                    </div>

                    <Clock3 className="h-5 w-5 text-brand" />
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      ["Prepare project presentation", "Tomorrow"],
                      ["Review API documentation", "Oct 1"],
                      ["Complete DSA practice", "Oct 2"],
                    ].map(([title, date]) => (
                      <div
                        key={title}
                        className="flex items-center justify-between rounded-button border border-border bg-background px-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <Circle className="h-4 w-4 shrink-0 text-text-muted" />

                          <span className="truncate text-sm text-text-secondary">
                            {title}
                          </span>
                        </div>

                        <span className="ml-3 shrink-0 text-xs text-text-muted">
                          {date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Productivity */}
                <div className="rounded-card border border-border bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Productivity</h3>

                      <p className="mt-1 text-xs text-text-muted">
                        Your progress this week
                      </p>
                    </div>

                    <Target className="h-5 w-5 text-brand" />
                  </div>

                  <div className="mt-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold">72%</p>
                        <p className="mt-1 text-xs text-text-muted">
                          Completion rate
                        </p>
                      </div>

                      <span className="text-sm font-medium text-success">
                        +12%
                      </span>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-border">
                      <div className="h-full w-[72%] rounded-full bg-brand" />
                    </div>

                    <div className="mt-3 flex justify-between text-xs text-text-muted">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Desktop;