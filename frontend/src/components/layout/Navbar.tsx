
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  ListTodo,
  Settings,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

type WorkspaceLink = {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  status?: string;
};

const Navbar = () => {
  const location = useLocation();

  const currentStatus = new URLSearchParams(location.search).get("status");

  const workspace: WorkspaceLink[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: "/",
    },
    {
      id: "my-tasks",
      label: "My Tasks",
      icon: <ListTodo className="h-4 w-4" />,
      path: "/tasks",
    },
    {
      id: "today",
      label: "Today",
      icon: <CalendarDays className="h-4 w-4" />,
      path: "/tasks?status=today",
      status: "today",
    },
    {
      id: "upcoming",
      label: "Upcoming",
      icon: <Clock3 className="h-4 w-4" />,
      path: "/tasks?status=upcoming",
      status: "upcoming",
    },
    {
      id: "completed",
      label: "Completed",
      icon: <CheckCircle2 className="h-4 w-4" />,
      path: "/tasks?status=completed",
      status: "completed",
    },
  ];

  const isLinkActive = (link: WorkspaceLink) => {
    if (link.id === "dashboard") {
      return location.pathname === "/";
    }

    if (link.path.startsWith("/tasks")) {
      if (location.pathname !== "/tasks") {
        return false;
      }

      // My Tasks is active only when no status filter is selected.
      if (!link.status) {
        return currentStatus === null;
      }

      return currentStatus === link.status;
    }

    return location.pathname === link.path;
  };

  const linkClasses = (isActive: boolean) =>
    `flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-brand/10 text-brand"
        : "text-text-secondary hover:bg-background hover:text-text-primary"
    }`;

  return (
    <nav className="flex-1 px-4 py-6">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Workspace
      </p>

      <div className="space-y-1">
        {workspace.map((link) => {
          const active = isLinkActive(link);

          return (
            <NavLink
              key={link.id}
              to={link.path}
              end
              aria-current={active ? "page" : undefined}
              className={linkClasses(active)}
            >
              {link.icon}
              {link.label}
            </NavLink>
          );
        })}
      </div>

      <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
        Preferences
      </p>

      <NavLink
        to="/settings"
        end
        className={linkClasses(location.pathname === "/settings")}
      >
        <Settings className="h-4 w-4" />
        Settings
      </NavLink>
    </nav>
  );
};

export default Navbar;
