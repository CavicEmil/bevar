import Eyebrow from "./ui/Eyebrow";
import Progress from "./ui/Progress";

/* Composition: existing label + progress primitive + optional onboarding hint.
   Supply the same ordered steps and current step used to display the content.
   For guides, these are recipe.step_by_step_guide rows, ordered by step_number.
   Completion is a separate screen, after the last real step. */
export default function ProgressBar({
  steps = [],
  currentStepId,
  variant = "guide",
  isComplete = false,
  className = "",
}) {
  if (!Array.isArray(steps) || steps.length === 0) return null;

  const index = steps.findIndex(step => step.id === currentStepId);
  if (index === -1) return null;

  const label = isComplete
    ? "✓  WELL PRESERVED"
    : `STEP ${index + 1} OF ${steps.length}`;
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
          <Progress value={index + 1} max={steps.length} label={label} />
          {isOnboarding && (
            <p className="m-0 text-right text-[12px] leading-[18px] font-normal">
              we can change these choices later
            </p>
          )}
        </>
      )}
    </div>
  );
}
