import {
  Camera,
  CheckCircle2,
  ChevronRight,
  LockKeyhole,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import TextInput from "../common/inputs/TextInput";

type ProfileType = {
  name: string | undefined;
  email: string | null;
  inputClasses: string;
  secondaryButtonClasses: string;
  setActiveTab: Dispatch<SetStateAction<"profile" | "security" | "account">>;
};

const UserProfile = ({
  name,
  email,
  inputClasses,
  secondaryButtonClasses,
  setActiveTab,
}: ProfileType) => {
  const [fullName, setFullName] = useState<string | undefined>(
    name || undefined,
  );
  console.log(name);
  return (
    <div className="space-y-5">
      {/* Profile information */}
      <section className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="flex items-center gap-3 border-b border-border p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <UserRound className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-text-primary">
              Profile information
            </h2>
            <p className="mt-0.5 text-sm text-text-secondary">
              Manage your personal information and account details.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Avatar and account identity */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="group relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-2xl font-semibold text-white">
              {fullName ? fullName.trim().charAt(0).toUpperCase() : "U"}

              <button
                type="button"
                aria-label="Change profile photo"
                title="Profile photo feature coming later"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="wrap-break-words font-semibold text-text-primary">
                {fullName || "Your name"}
              </h3>

              <p className="mt-1 break-all text-sm text-text-secondary">
                {email}
              </p>

              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
            </div>
          </div>

          {/* Profile form */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>

                <TextInput
                  handleChange={(e) => setFullName(e.target.value)}
                  name={"name"}
                  placeholder="Update Your name"
                  value={name}
                  type="text"
                  title="Full Name"
                  error=""
                />
               
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-text-secondary"
                >
                  Email address
                </label>

                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    readOnly
                    className={`${inputClasses} cursor-not-allowed pr-10 opacity-60`}
                  />

                  <LockKeyhole className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                </div>

                <p className="mt-2 text-xs leading-5 text-text-muted">
                  Your email address cannot be changed here.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
              <button
                type="button"
                onClick={() => setFullName("vivek sharma")}
                className={secondaryButtonClasses}
              >
                Reset
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-button bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                <Save className="h-4 w-4" />
                Save changes
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Security shortcut */}
      <section className="rounded-card border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-text-primary">
              Keep your account secure
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-secondary">
              Manage your password and review account security options.
            </p>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand transition hover:text-brand-hover"
            >
              Security settings
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;
