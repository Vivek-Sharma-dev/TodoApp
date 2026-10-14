import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  ListTodo,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

type WorkspaceLink = {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
};

const Navbar = () => {
  const workspace: WorkspaceLink[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: "/desktop",
    },
    {
      id: "my tasks",
      label: "My Tasks",
      icon: <ListTodo className="h-4 w-4" />,
      path: "/tasks",
    },
    {
      id: "today",
      label: "Today",
      icon: <CalendarDays className="h-4 w-4" />,
      path: "/today-tasks",
    },
    {
      id: "upcoming",
      label: "Upcoming",
      icon: <Clock3 className="h-4 w-4" />,
      path: "/upcoming",
    },
    {
      id: "completed",
      label: "Completed",
      icon: <CheckCircle2 className="h-4 w-4" />,
      path: "/completed",
    },
  ];
  return (
    <>
      <nav className="flex-1 px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Workspace
        </p>

        <div className="space-y-1">
          {workspace.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "text-brand bg-brand/10"
                    : "text-text-secondary hover:bg-background hover:text-text-primary"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>

        <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Preferences
        </p>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "text-brand bg-brand/10"
                : "text-text-secondary hover:bg-background hover:text-text-primary"
            }`
          }
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
      </nav>
    </>
  );
};

export default Navbar;
