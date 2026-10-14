import { LoaderCircle } from "lucide-react";

type LoadingProps = {
  message?: string;
  fullScreen?: boolean;
};

const Loading = ({
  message = "Loading...",
  fullScreen = false,
}: LoadingProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? "min-h-screen" : "min-h-48"
      }`}
      role="status"
      aria-live="polite"
    >
      <LoaderCircle
        className="h-8 w-8 animate-spin text-purple-500"
        aria-hidden="true"
      />

      <p className="text-sm text-zinc-400">{message}</p>
    </div>
  );
};

export default Loading;
