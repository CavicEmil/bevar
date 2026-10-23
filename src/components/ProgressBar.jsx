import Eyebrow from "./ui/Eyebrow";

// The parent owns navigation. Pass the same ordered steps used by the content.
export default function ProgressBar({
  steps = [],
  currentStepId,
  variant = "guide",
  isComplete = false,
  className = "",
}) {
  if (!Array.isArray(steps) || steps.length === 0) return null;

  const index = steps.findIndex((step) => step.id === currentStepId);
  if (index === -1 && !isComplete) return null;

  const total = steps.length;
  const current = isComplete ? total : index + 1;
  const label = isComplete
    ? "✓  WELL PRESERVED"
    : `STEP ${current} OF ${total}`;
  const isOnboarding = variant === "onboarding";

  return (
    <div
      className={`flex w-full min-w-0 flex-col font-the-one text-spicy-berry ${
        isOnboarding ? "gap-[7px]" : "gap-section"
      } ${className}`}
    >
      <div role="status" aria-live="polite" aria-atomic="true">
        <Eyebrow
          content={label}
          className="m-0 [font-size:11px] [line-height:1.4] font-semibold"
        />
      </div>

      {!isComplete && (
        <>
          <div
            role="progressbar"
            aria-label="Step progress"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={current}
            aria-valuetext={label}
            className="h-[4px] w-full overflow-hidden rounded-[4px] bg-white"
          >
            <div
              className="h-full bg-spicy-berry transition-[width] duration-300 ease-out motion-reduce:transition-none"
              style={{ width: `${(current / total) * 100}%` }}
            />
          </div>

          {isOnboarding && (
            <p className="m-0 text-right text-[12px] leading-[18px] font-normal">
              You can change these choices later
            </p>
          )}
        </>
      )}
    </div>
  );
}
