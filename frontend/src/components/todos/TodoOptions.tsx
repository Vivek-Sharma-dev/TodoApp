
import { useEffect, useRef, useState } from "react";
import {
  Check,
  Circle,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

type TodoOptionsProps = {
  completed: boolean;
  onEdit: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
};

export const TodoOptions = ({
  completed,
  onEdit,
  onToggleComplete,
  onDelete,
}: TodoOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <div ref={menuRef} className="relative shrink-0">
      {/* Three-dot trigger */}
      <button
        type="button"
        aria-label="Todo options"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="rounded-lg p-2 text-text-muted transition
          hover:bg-background hover:text-text-primary
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-brand"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {/* Options menu */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Todo actions"
          className="absolute right-0 top-full z-50 mt-2
            w-52 overflow-hidden rounded-xl border border-border
            bg-surface p-1.5 shadow-xl"
        >
          {/* Edit */}
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onEdit)}
            className="flex w-full items-center gap-3 rounded-lg
              px-3 py-2.5 text-left text-sm text-text-primary
              transition hover:bg-background
              focus-visible:outline-none focus-visible:bg-background"
          >
            <Pencil className="h-4 w-4 text-text-secondary" />
            Edit Todo
          </button>

          {/* Complete / Incomplete */}
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onToggleComplete)}
            className="flex w-full items-center gap-3 rounded-lg
              px-3 py-2.5 text-left text-sm text-text-primary
              transition hover:bg-background
              focus-visible:outline-none focus-visible:bg-background"
          >
            {completed ? (
              <Circle className="h-4 w-4 text-text-secondary" />
            ) : (
              <Check className="h-4 w-4 text-text-secondary" />
            )}

            {completed ? "Mark as incomplete" : "Mark as complete"}
          </button>

          <div className="my-1 border-t border-border" />

          {/* Delete */}
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onDelete)}
            className="flex w-full items-center gap-3 rounded-lg
              px-3 py-2.5 text-left text-sm text-error
              transition hover:bg-error/10
              focus-visible:outline-none focus-visible:bg-error/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete Todo
          </button>
        </div>
      )}
    </div>
  );
};
