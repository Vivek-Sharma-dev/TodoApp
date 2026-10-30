import { useState } from "react";
import {
  UserRound,
  ShieldCheck,
  Trash2,
  Monitor,
  CalendarDays,
  CheckCircle2,
  ListTodo,
  ChartNoAxesColumnIncreasing,
  Crown,
  AlertTriangle,
  Eye,
  EyeOff,
  LogOut,
  Mail,
} from "lucide-react";
import UserProfile from "../components/settings/UserProfile";
import { useCurrentUser } from "../hooks/auth/useCurrentUser";

type SettingsTab = "profile" | "security" | "account";

const Settings = () => {
  const { data: currentUser, isPending: isUserPending } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [showPassword, setShowPassword] = useState(false);
  // Temporary UI values. Connect these to your user API later.
  
  if (isUserPending) {
    return <div>Loading</div>;
  }
  const email = currentUser?.email || "Email Not available";
  const name = currentUser?.name || "guest user"

  const navigation = [
    { id: "profile" as const, label: "Profile", icon: UserRound },
    { id: "security" as const, label: "Security", icon: ShieldCheck },
    { id: "account" as const, label: "Account", icon: Trash2 },
  ];

  const inputClasses =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/15";

  const secondaryButtonClasses =
    "inline-flex items-center justify-center gap-2 rounded-button border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition hover:border-border-hover hover:bg-background";

  const renderSecurity = () => (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="flex items-center gap-3 border-b border-border p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-text-primary">Security</h2>
            <p className="mt-0.5 text-sm text-text-secondary">
              Keep your account and personal information secure.
            </p>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <h3 className="font-medium text-text-primary">Change password</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Choose a strong password that you don't use elsewhere.
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                Current password
              </label>

              <input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your current password"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                New password
              </label>

              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  className={`${inputClasses} pr-11`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-text-secondary"
              >
                Confirm new password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your new password"
                className={inputClasses}
              />
            </div>

            <div className="flex justify-end border-t border-border pt-5">
              <button
                type="submit"
                className="rounded-button bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                Update password
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="flex items-center gap-3 border-b border-border p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Monitor className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-text-primary">Active sessions</h2>
            <p className="mt-0.5 text-sm text-text-secondary">
              Review where you're signed in.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background text-text-secondary">
            <Monitor className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-primary">
              Current browser session
            </p>
            <p className="mt-1 text-xs text-text-muted">
              This device · Current session
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Active
          </span>
        </div>

        <div className="border-t border-border p-5">
          <p className="text-sm leading-6 text-text-secondary">
            Session management will be available when the backend supports
            listing and revoking individual sessions.
          </p>
        </div>
      </section>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="flex items-center gap-3 border-b border-border p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-error/10 text-error">
            <Trash2 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-text-primary">Account</h2>
            <p className="mt-0.5 text-sm text-text-secondary">
              Manage your account and personal data.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-error/10 text-error">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-text-primary">Delete account</h3>

              <p className="mt-1 text-sm leading-6 text-text-secondary">
                Permanently delete your account and associated data. This action
                may not be reversible.
              </p>

              <button
                type="button"
                disabled
                title="Account deletion is not connected yet"
                className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-button border border-error/20 bg-error/5 px-4 py-2.5 text-sm font-medium text-error opacity-70"
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </button>

              <p className="mt-3 text-xs text-text-muted">
                Account deletion will be enabled after the backend securely
                handles data cleanup and confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-card border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background text-text-secondary">
            <LogOut className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-text-primary">Sign out</h3>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              Sign out of your current account on this device.
            </p>
          </div>

          <button
            type="button"
            disabled
            title="Connect your existing logout handler here"
            className={`${secondaryButtonClasses} cursor-not-allowed opacity-60`}
          >
            Sign out
          </button>
        </div>
      </section>
    </div>
  );

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-text-primary sm:px-6 sm:py-8 lg:px-8 lg:ml-64">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="mb-8">
          <p className="text-sm font-medium text-brand">Settings</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Manage your account
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            Update your profile, manage security settings, and control your
            account.
          </p>
        </header>

        {/* Main layout */}
        <div className="grid items-start gap-5 lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)_280px]">
          {/* Settings navigation */}
          <aside className="rounded-card border border-border bg-surface p-2">
            <div className="flex gap-1 overflow-x-auto lg:flex-col">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex shrink-0 items-center gap-3 rounded-button px-3 py-3 text-sm font-medium transition lg:w-full ${
                      isActive
                        ? "bg-brand/10 text-brand"
                        : "text-text-secondary hover:bg-background hover:text-text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Selected settings section */}
          <div className="min-w-0">

            {activeTab === "profile" && (
              <UserProfile
                name={name}
                email={email}
                inputClasses={inputClasses}
                secondaryButtonClasses={secondaryButtonClasses}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === "security" && renderSecurity()}
            {activeTab === "account" && renderAccount()}
          </div>

          {/* Account overview */}
          <aside className="space-y-5 lg:col-span-2 xl:col-span-1">
            <section className="overflow-hidden rounded-card border border-border bg-surface">
              <div className="flex items-center gap-3 border-b border-border p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <ChartNoAxesColumnIncreasing className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-text-primary">
                    Account overview
                  </h2>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    A snapshot of your account.
                  </p>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 shrink-0 text-text-muted" />

                  <span className="flex-1 text-sm text-text-secondary">
                    Member since
                  </span>

                  <span className="text-right text-sm font-medium text-text-primary">
                    —
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-text-muted" />

                  <span className="flex-1 text-sm text-text-secondary">
                    Email verified
                  </span>

                  <span className="text-sm font-medium text-success">
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <ListTodo className="h-4 w-4 shrink-0 text-text-muted" />

                  <span className="flex-1 text-sm text-text-secondary">
                    Total tasks
                  </span>

                  <span className="text-sm font-medium text-text-primary">
                    —
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-text-muted" />

                  <span className="flex-1 text-sm text-text-secondary">
                    Completed tasks
                  </span>

                  <span className="text-sm font-medium text-text-primary">
                    —
                  </span>
                </div>
              </div>
            </section>

            {/* Encouragement card */}
            <section className="relative overflow-hidden rounded-card border border-brand/30 bg-linear-to-br from-brand/20 via-surface to-surface p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <Crown className="h-5 w-5" />
              </div>

              <h2 className="font-semibold text-text-primary">
                You're doing great!
              </h2>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Keep managing your tasks and making progress, one step at a
                time.
              </p>
            </section>

            {/* Account contact */}
            <section className="rounded-card border border-border bg-surface p-5">
              <div className="flex items-center gap-2 text-text-secondary">
                <Mail className="h-4 w-4" />
                <h2 className="text-sm font-semibold text-text-primary">
                  Account help
                </h2>
              </div>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Need help with your account? Support options can be added here
                later.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Settings;
