import { AlertTriangle, Target, X } from "lucide-react";

type ConfirmationModalProps = {
  action: string;
  actionName: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
  isPending?: boolean;
  isError: string | undefined;
};

const ConfirmationModal = ({
  action,
  actionName,
  description,
  onConfirm,
  onClose,
  isPending = false,
  isError,
}: ConfirmationModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400"
        >
          {isError}
        </div>
      )}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-description"
        className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            {action.toLowerCase() === "completed" ? (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                <Target size={20} />
              </div>
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-error/10 text-error">
                <AlertTriangle size={20} />
              </div>
            )}

            <div>
              <h2
                id="confirmation-title"
                className="text-base font-semibold text-text-primary"
              >
                {actionName}?
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Please confirm your action.
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close confirmation"
            disabled={isPending}
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary transition hover:bg-background hover:text-text-primary disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Description */}
        <div className="px-5 py-5">
          <p
            id="confirmation-description"
            className="text-sm leading-6 text-text-secondary"
          >
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 rounded-b-2xl border-t border-border bg-background/50 px-5 py-4">
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-background hover:text-text-primary disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 ${action.toLowerCase() === "completed" ? `bg-success/70` : "bg-error"}`}
          >
            {isPending ? "Processing..." : actionName}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
