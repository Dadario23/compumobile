// src/components/StepIndicator.tsx
"use client";

interface Step {
  label: string;
  icon: string;
}

interface StepIndicatorProps {
  steps: Step[];
  current: number; // 0-based index
}

export default function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 select-none">
      {steps.map((step, i) => {
        const state =
          i < current ? "done" : i === current ? "active" : "pending";
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`step-dot ${state}`}>
                {state === "done" ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span
                className="text-[0.65rem] font-medium whitespace-nowrap"
                style={{
                  color:
                    state === "active"
                      ? "var(--accent)"
                      : state === "done"
                      ? "var(--success)"
                      : "var(--text-muted)",
                }}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="h-px w-8 sm:w-12 mx-1 mb-5"
                style={{
                  background:
                    i < current ? "var(--success)" : "var(--border)",
                  transition: "background 0.3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
