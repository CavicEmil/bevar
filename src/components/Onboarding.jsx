import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { getCategories, getFruits } from "../api/reference";
import { getPublicUrl, BUCKETS } from "../api/media";


import {
  ONBOARDING_STEPS,
  ONBOARDING_TIMES,
  emptyPreferences,
} from "../constants/onboarding";

import ProgressBar from "./ProgressBar";
import Button from "./ui/Button";
import Chip from "./ui/Chip";
import Heading from "./ui/Heading";

export default function Onboarding({
  onComplete,
  initialPreferences,
}) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const [preferences, setPreferences] = useState(() => ({
    ...emptyPreferences(),
    ...initialPreferences,
  }));

  const [options, setOptions] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const title = useRef(null);
  const step = ONBOARDING_STEPS[index];
  const isLastStep = index === ONBOARDING_STEPS.length - 1;

  /* Load fruits and categories through the existing API. */
  useEffect(() => {
    let active = true;

    Promise.all([getFruits(), getCategories()])
      .then(([fruits, categories]) => {
        if (active) {
          setOptions({
            fruits: fruits ?? [],
            categories: categories ?? [],
          });
        }
      })
      .catch(() => {
        if (active) {
          setError("Could not load the choices. Please try again.");
        }
      });

    return () => {
      active = false;
    };
  }, [retry]);

  /* Focus the heading when switching steps. */
  useEffect(() => {
    title.current?.focus();
  }, [index]);

  function toggle(field, id) {
    setPreferences((current) => ({
      ...current,
      [field]: current[field].includes(id)
        ? current[field].filter((value) => value !== id)
        : [...current[field], id],
    }));
  }


  function nextStep() {
    if (!isLastStep) {
      setIndex((current) => current + 1);
      return;
    }

    onComplete(preferences);   // Landing persists the flag

    const params = new URLSearchParams();

    if (preferences.fruitIds.length)
      params.set("fruitIds", preferences.fruitIds.join(","));
    if (preferences.categoryIds.length)
      params.set("categoryIds", preferences.categoryIds.join(","));
    if (preferences.preparationTime)
      params.set("time", preferences.preparationTime);

    navigate(`/recipes${params.size ? `?${params}` : ""}`);
  }

    /* Skip = next step, but with this step's preference left empty. */
  function skipStep() {
    // clear whatever the current step collects, then advance
    setPreferences((current) => ({
      ...current,
      [step.preferenceField]: step.id === "time" ? null : [],
    }));

    advance();
  }

  /* Shared advance logic — both buttons end here. */
  function advance() {
    if (!isLastStep) {
      setIndex((current) => current + 1);
      return;
    }

    onComplete(preferences);   // Landing persists the flag

    // build URL params only from what was actually chosen —
    // empty preferences naturally produce "/recipes" with no query string
    const params = new URLSearchParams();
    if (preferences.fruitIds.length)     params.set("fruitIds", preferences.fruitIds.join(","));
    if (preferences.categoryIds.length)   params.set("categoryIds", preferences.categoryIds.join(","));
    if (preferences.preparationTime)      params.set("time", preferences.preparationTime);

    navigate(`/recipes${params.size ? `?${params}` : ""}`);
  }

  const allFruits =
    !!options?.fruits.length &&
    options.fruits.every((fruit) =>
      preferences.fruitIds.includes(fruit.id)
    );

  return (
    <div className="flex w-full min-w-0 flex-col gap-section font-the-one text-dark-humor">
      <ProgressBar
        steps={ONBOARDING_STEPS}
        currentStepId={step.id}
        variant="onboarding"
      />

      <div ref={title} tabIndex={-1} className="outline-none">
        <Heading content={step.title} level={1} variant={3} />

        <p className="mt-related text-body">
          {step.description}
        </p>
      </div>

      {error ? (
        <div role="alert">
          <p className="mb-related text-body">{error}</p>

          <Button
            content="Try again"
            variant="secondary"
            onClick={() => {
              setError("");
              setRetry((current) => current + 1);
            }}
          />
        </div>
      ) : !options ? (
        <p role="status">Loading choices…</p>
      ) : (
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="sr-only">{step.title}</legend>

          {/* Fruit selection. */}
          {step.id === "fruit" && (
            <>
              <div
                className="
                  grid grid-cols-3 gap-x-objects gap-y-section
                  rounded-card bg-white p-4
                  min-[360px]:grid-cols-4
                "
              >
                {options.fruits.map((fruit) => (
                  <Chip
                    key={fruit.id}
                    variant="fruit"
                    item={fruit}
                    label={fruit.name}
                    imageSrc={getPublicUrl(BUCKETS.fruitImages, fruit.image_path)}
                    selected={preferences.fruitIds.includes(fruit.id)}
                    name="onboarding-fruits"
                    onChange={() => toggle("fruitIds", fruit.id)}
                  />
                ))}
              </div>

              <label
                className="
                  mt-related flex cursor-pointer items-center
                  justify-between gap-related rounded-button--icons
                  bg-white p-3 text-body
                "
              >
                <span>I’m here to explore. Select all</span>

                <input
                  type="checkbox"
                  checked={allFruits}
                  disabled={!options.fruits.length}
                  className="size-5 shrink-0 accent-spicy-berry"
                  onChange={() =>
                    setPreferences((current) => ({
                      ...current,
                      fruitIds: allFruits
                        ? []
                        : options.fruits.map((fruit) => fruit.id),
                    }))
                  }
                />
              </label>
            </>
          )}

          {/* Preparation-time selection. */}
          {step.id === "time" && (
            <div className="flex flex-col gap-related">
              {ONBOARDING_TIMES.map((time) => (
                <Chip
                  key={time.id}
                  variant="time"
                  type="radio"
                  name="onboarding-time"
                  value={time.id}
                  label={time.label}
                  description={time.description}
                  selected={preferences.preparationTime === time.id}
                  onChange={() =>
                    setPreferences((current) => ({
                      ...current,
                      preparationTime: time.id,
                    }))
                  }
                />
              ))}
            </div>
          )}

          {/* Category selection. */}
          {step.id === "category" && (
            <>
              <div className="grid grid-cols-2 gap-related">
                {options.categories.map((category) => (
                  <Chip
                    key={category.id}
                    variant="category"
                    item={category}
                    name="onboarding-categories"
                    selected={preferences.categoryIds.includes(
                      category.id
                    )}
                    onChange={() =>
                      toggle("categoryIds", category.id)
                    }
                    className="h-full"
                  />
                ))}
              </div>

              <label
                className="
                  mt-related flex cursor-pointer items-center
                  justify-between gap-related rounded-button--icons
                  bg-white p-3 text-body
                "
              >
                <span>I don’t know yet.</span>

                <input
                  type="checkbox"
                  checked={!preferences.categoryIds.length}
                  className="size-5 shrink-0 accent-spicy-berry"
                  onChange={() =>
                    setPreferences((current) => ({
                      ...current,
                      categoryIds: [],
                    }))
                  }
                />
              </label>
            </>
          )}
        </fieldset>
      )}

      <div className="flex w-full flex-col gap-related pt-section">
        {/* Equal-width navigation buttons. */}
        <div className="flex w-full gap-related">
          {index > 0 && (
            <Button
              content="Back"
              icon="back"
              iconPosition="left"
              variant="secondary"
              ariaLabel="Previous step"
              className="min-w-0 flex-1"
              onClick={() => setIndex((current) => current - 1)}
            />
          )}

          <Button
            content={isLastStep ? "Find me a recipe" : "Next step"}
            icon="next"
            iconPosition="right"
            variant="primary"
            ariaLabel={
              isLastStep ? "Finish onboarding" : "Next step"
            }
            disabled={!options || !!error}
            className="min-w-0 flex-1"
            onClick={nextStep}
          />
        </div>

        <button
          type="button"
          onClick={skipStep}
          className="
            min-h-[44px] cursor-pointer self-center
            bg-transparent px-2 text-body
            focus-visible:outline-2
            focus-visible:outline-spicy-berry
          "
        >
          Skip
        </button>
      </div>
    </div>
  );
}