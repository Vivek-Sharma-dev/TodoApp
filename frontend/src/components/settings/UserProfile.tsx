import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import ProfileAvatar from "./ProfileAvatar";
import EditNameModal from "./EditNameModal";

type ProfileType = {
  name: string | undefined;
  email: string | null;
  inputClasses: string;
  secondaryButtonClasses: string;
  setActiveTab: Dispatch<SetStateAction<"profile" | "security" | "account">>;
};

const UserProfile = ({ name, email, setActiveTab }: ProfileType) => {
  const [isEditAvatarOpen, setIsEditAvatarOpen] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isUpdateEmailOpen, setIsUpdateEmailOpen] = useState(false);

  const displayName = name?.trim() || "Your name";

  return (
    <div className="space-y-5">
      {/* Profile overview */}
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
              View and manage your personal information.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Avatar and identity */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <ProfileAvatar
              name={name ?? ""}
              onEdit={() => setIsEditAvatarOpen(true)}
            />

            <div className="min-w-0 flex-1">
              <h3 className="break-words text-xl font-semibold text-text-primary">
                {displayName}
              </h3>

              <p className="mt-1 break-all text-sm text-text-secondary">
                {email || "No email available"}
              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Email verified
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsEditAvatarOpen(true)}
              className="inline-flex items-center justify-center gap-2 self-start rounded-button border border-border px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-background sm:self-center"
            >
              Change photo
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Personal information */}
          <div className="mt-8 border-t border-border pt-6">
            <div className="mb-4">
              <h3 className="font-semibold text-text-primary">
                Personal details
              </h3>

              <p className="mt-1 text-sm text-text-secondary">
                Manage the information associated with your account.
              </p>
            </div>

            <div className="divide-y divide-border">
              {/* Name */}
              <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-text-secondary">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-text-secondary">Full name</p>

                    <p className="mt-1 break-words font-medium text-text-primary">
                      {displayName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditNameOpen(true)}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-button border border-border px-3 py-2 text-sm font-medium text-text-primary transition hover:border-brand hover:text-brand sm:self-center"
                >
                  Edit name
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-text-secondary">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-text-secondary">Email address</p>

                    <p className="mt-1 break-all font-medium text-text-primary">
                      {email || "No email available"}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Your email address cannot be changed yet.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUpdateEmailOpen(true)}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-button border border-border px-3 py-2 text-sm font-medium text-text-secondary transition hover:border-brand hover:text-brand sm:self-center"
                >
                  Update email
                  <Clock3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
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
              Manage your password and review your account security options.
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
      {isEditNameOpen && (
        <EditNameModal
          initialName={name ?? ""}
          onClose={() => setIsEditNameOpen(false)}
          onSuccess={() => {
            setIsEditNameOpen(false);
          }}
        />
      )}

      {/*
        Modal components will be mounted here in the next steps:

        EditAvatarModal
        EditNameModal
        UpdateEmailModal
      */}
    </div>
  );
};

export default UserProfile;
