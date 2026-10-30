import { Target } from "lucide-react";
import React from "react";

const ProductivityBar = ({
  totalCompleted,
  totalTodos,
}: {
  totalCompleted: number;
  totalTodos: number;
}) => {
  const completionRate =
    totalTodos > 0 ? Math.round((totalCompleted / totalTodos) * 100) : 0;
  return (
    <div>
      <section className="rounded-card border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Productivity</h3>
            <p className="mt-1 text-xs text-text-muted">
              Your overall task completion
            </p>
          </div>
          <Target className="h-5 w-5 text-brand" />
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-bold">{completionRate}%</p>
              <p className="mt-1 text-xs text-text-muted">Completion rate</p>
            </div>
            <span className="text-sm font-medium text-text-secondary">
              {totalCompleted} of {totalTodos} tasks
            </span>
          </div>

          <div
            className="mt-5 h-2 overflow-hidden rounded-full bg-border"
            role="progressbar"
            aria-label="Task completion rate"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={completionRate}
          >
            <div
              className="h-full rounded-full bg-brand transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-text-muted">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductivityBar;
