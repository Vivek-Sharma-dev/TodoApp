import { AlertCircle, RefreshCw } from "lucide-react";

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

const ErrorState = ({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) => {
  return (
    <div
      className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center"
      role="alert"
    >
      <AlertCircle
        className="h-8 w-8 text-red-400"
        aria-hidden="true"
      />

      <p className="max-w-md text-sm text-zinc-300">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorState;