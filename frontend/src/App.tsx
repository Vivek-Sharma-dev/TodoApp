import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import { useCurrentUser } from "./hooks/auth/useCurrentUser";
import Navbar from "./components/layout/Navbar";
import { User } from "lucide-react";

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

const now = new Date();
const App = () => {
  const { data: currentUser, isPending: isUserPending } = useCurrentUser();
  const firstName = currentUser?.name?.trim().split(/\s+/)[0] || "there";

  return (
    <>
      <div className="">
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
        <Header
          getGreeting={getGreeting}
          formatDate={formatDate}
          firstName={firstName}
          now={now}
        />
      </div>
      <main className="">
        <Outlet />
      </main>
    </>
  );
};

export default App;
