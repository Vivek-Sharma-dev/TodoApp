import { Camera, UserRound } from "lucide-react";

type ProfileAvatarProps = {
  name: string;
  onEdit: () => void;
  size?: "sm" | "lg";
};

const ProfileAvatar = ({
  name,
  onEdit,
  size = "lg",
}: ProfileAvatarProps) => {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "";

  const sizeClasses =
    size === "lg"
      ? "h-24 w-24 text-3xl"
      : "h-12 w-12 text-base";

  return (
    <div
      className={`group relative flex shrink-0 items-center justify-center rounded-full bg-brand font-semibold text-white ${sizeClasses}`}
    >
      {initials || <UserRound className="h-9 w-9" />}

      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit profile picture"
        title="Edit profile picture"
        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        <Camera className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ProfileAvatar;