import { useEffect, useState, type FormEvent } from "react";
import { LoaderCircle, Save, UserRound, X } from "lucide-react";

import { UpdateUserSchema } from "../../../../shared/schemas/auth.schema";
import { useUpdateMe } from "../../hooks/auth/useUpdateMe";

type EditNameModalProps = {
  initialName: string;
  onClose: () => void;
  onSuccess: (updatedName: string) => void;
};

const EditNameModal = ({
  initialName,
  onClose,
  onSuccess,
}: EditNameModalProps) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");
  const { mutate, isPending } = useUpdateMe();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isPending, onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = UpdateUserSchema.safeParse({
      name: name.trim(),
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    if (result.data.name === initialName.trim()) {
      onClose();
      return;
    }

    mutate(result.data, {
      onSuccess: () => {
        onSuccess(result.data.name);
      },
      onError: () => {
        setError("Failed to update your name. Please try again.");
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-name-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-border p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="edit-name-title"
                className="font-semibold text-text-primary"
              >
                Edit your name
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Update the name displayed on your account.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-2 p-5">
            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-text-primary"
            >
              Full name
            </label>

            <input
              id="profile-name"
              name="name"
              type="text"
              autoComplete="name"
              autoFocus
              maxLength={100}
              value={name}
              disabled={isPending}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              placeholder="Enter your full name"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "profile-name-error" : undefined}
              className={`w-full rounded-input border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                error
                  ? "border-error/60 focus:border-error focus:ring-error/10"
                  : "border-border focus:border-brand focus:ring-brand/10"
              }`}
            />

            {error && (
              <p
                id="profile-name-error"
                role="alert"
                className="text-sm text-error"
              >
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border p-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-button border border-border px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-button bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditNameModal;