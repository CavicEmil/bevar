import { useId, useRef, useState } from "react";
import { getPublicUrl } from "../../api/media";
import IngredientCalculator from "../IngredientCalculator";

export default function IngredientCalculatorButton({
  recipe,
  iconPath = "calculator.svg",
  iconBucket = "recipe-images",
  onApply,
  initialAmount,
  baseIngredientId,
  note,
  className = "",
}) {
  const dialogRef = useRef(null);
  const dialogId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [applied, setApplied] = useState(null);
  const currentAmount = applied?.recipeId === recipe?.id
    ? applied.fruitAmount
    : initialAmount;
  const iconUrl = !iconPath ? undefined
    : /^https?:\/\//i.test(iconPath) ? iconPath
    : iconBucket ? getPublicUrl(iconBucket, iconPath) : undefined;

  function openCalculator() {
    setIsOpen(true);
    dialogRef.current.showModal();
  }

  function closeCalculator() {
    dialogRef.current.close();
  }

  async function applyAmount(result) {
    await onApply(result);
    setApplied(result);
    closeCalculator();
  }

  return (
    <>
      <button
        type="button"
        onClick={openCalculator}
        disabled={!recipe?.id}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={isOpen}
        className={`flex w-full cursor-pointer items-center justify-between gap-related rounded-card bg-poplar-pink p-page text-left font-the-one focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-spicy-berry disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        <span className="flex min-w-0 flex-col gap-objects">
          <span className="text-heading-2 text-spicy-berry">
            Calculate ingredients
          </span>
          <span className="text-body text-dark-humor">
            Make the recipe fit your amount.
          </span>
        </span>
        {iconUrl && (
          <img
            src={iconUrl}
            alt=""
            aria-hidden="true"
            className="h-[32px] w-[32px] shrink-0 object-contain"
          />
        )}
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label="Calculate ingredients"
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right
            || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            closeCalculator();
          }
        }}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-40px)] max-w-[440px] overflow-y-auto rounded-card border-0 bg-white p-card-lg text-dark-humor backdrop:bg-dark-humor/50"
      >
        {isOpen && (
          <>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeCalculator}
                className="cursor-pointer rounded-button--icons p-button text-button-big text-spicy-berry focus-visible:outline-2 focus-visible:outline-spicy-berry"
              >
                Close
              </button>
            </div>
            <IngredientCalculator
              recipe={recipe}
              initialAmount={currentAmount}
              baseIngredientId={baseIngredientId}
              note={note}
              onApply={typeof onApply === "function" ? applyAmount : undefined}
            />
          </>
        )}
      </dialog>
    </>
  );
}
