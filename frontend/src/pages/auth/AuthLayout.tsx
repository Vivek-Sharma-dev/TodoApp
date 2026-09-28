import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2400&q=80')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/90" />

      {/* Brand glow */}
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />

      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-brand/5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left side */}
        <section className="hidden flex-1 flex-col justify-center px-12 lg:flex xl:px-20">
          <div className="max-w-xl">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-button bg-brand text-background font-bold">
                T
              </div>

              <span className="text-xl font-semibold tracking-tight">
                Todo<span className="text-brand">App</span>
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-text-primary xl:text-6xl">
              Organize your work.
              <br />
              <span className="text-brand">Own your time.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-text-secondary">
              A simple and powerful way to manage your tasks, stay focused,
              and keep track of what actually matters.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Manage your daily tasks",
                "Set priorities and due dates",
                "Stay focused and productive",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-brand">
                    ✓
                  </div>

                  <span className="text-sm text-text-secondary">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right side */}
        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-130 lg:px-10 xl:w-145">
          <div className="w-full max-w-md rounded-card border border-border bg-surface/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;