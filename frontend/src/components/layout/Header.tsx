import { Bell, Search, User } from "lucide-react";
import React from "react";

type PropsType = {
  getGreeting: () => string;
  formatDate: (arg0: Date) => string;
  firstName: string;
  now: Date
};

const Header = ({getGreeting, formatDate, firstName, now}:PropsType) => {
  return (
    <>
      <header className="flex min-h-20 items-center justify-between gap-4 border-b border-border bg-background px-5 py-4 sm:px-8">
        <div className="min-w-0">
          <p className="text-sm text-text-muted">{formatDate(now)}</p>
          <h1 className="mt-0.5 text-xl font-semibold tracking-tight">
            {getGreeting()}, {firstName} 👋
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="hidden h-10 items-center gap-2 rounded-button border border-border bg-surface px-3 text-sm text-text-muted transition hover:border-border-hover hover:text-text-secondary sm:flex"
          >
            <Search className="h-4 w-4" />
            <span>Search tasks</span>
            <kbd className="ml-4 rounded border border-border px-1.5 py-0.5 text-[10px]">
              /
            </kbd>
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-button border border-border bg-surface text-text-secondary transition hover:border-border-hover hover:text-text-primary"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand" />
          </button>

          <button
            type="button"
            aria-label="Your profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand lg:hidden"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
