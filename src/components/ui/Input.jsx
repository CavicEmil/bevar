import { useId, useState } from "react";

/* Default settings for each input variant */
const variants = {
  name: {
    label: "Name",
    name: "firstName",
    type: "text",
    placeholder: "Your first name",
    autoComplete: "given-name",
    required: true,
  },

  surname: {
    label: "Surname",
    name: "lastName",
    type: "text",
    placeholder: "Your last name",
    autoComplete: "family-name",
    required: true,
  },

  email: {
    label: "E-mail address",
    name: "email",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
    required: true,
  },

  password: {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "At least 8 characters",
    autoComplete: "new-password",
    minLength: 8,
    required: true,
  },

  calculator: {
    label: "How much fruit do you have?",
    name: "fruitAmount",
    type: "number",
    placeholder: "1000",
    min: 1,
    step: 1,
    required: true,
  },

  search: {
    label: "Search fruit or recipe",
    name: "search",
    type: "search",
    placeholder: "Search fruit or recipe",
    required: false,
  },
};

/* Translate browser validation results into inline messages */
function getValidationMessage(input) {
  const { validity } = input;

  if (validity.badInput) {
    return "Please enter a valid number.";
  }

  if (
    validity.valueMissing ||
    (input.required &&
      input.type === "text" &&
      !input.value.trim())
  ) {
    return "Please fill in this field.";
  }

  if (validity.typeMismatch && input.type === "email") {
    return "Please enter a valid e-mail address.";
  }

  if (validity.tooShort) {
    return `Please enter at least ${input.minLength} characters.`;
  }

  if (validity.rangeUnderflow) {
    return `Please enter ${input.min} or more.`;
  }

  if (validity.rangeOverflow) {
    return `Please enter ${input.max} or less.`;
  }

  if (validity.stepMismatch) {
    return "Please enter a valid amount.";
  }

  if (!validity.valid) {
    return "Please check this value.";
  }

  return "";
}

export default function Input({
  variant = "name",
  id,
  label,
  unit,
  error,
  className = "",
  onChange,
  onBlur,
  onInvalid,
  ...inputProps
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState("");

  const {
    label: defaultLabel,
    ...defaults
  } = variants[variant] || variants.name;

  const isCalculator = variant === "calculator";
  const fieldLabel = label ?? defaultLabel;
  const fieldUnit = unit ?? (isCalculator ? "g" : undefined);

  /* External errors can be supplied by the page */
  const message = error || validationError;

  const describedBy = [
    fieldUnit ? `${inputId}-unit` : null,
    message ? `${inputId}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");

  function validate(input) {
    const message = getValidationMessage(input);

    /* Include custom validation when the form is submitted */
    input.setCustomValidity(message);
    setValidationError(message);
  }

  function handleBlur(event) {
    setTouched(true);
    event.currentTarget.setCustomValidity("");
    validate(event.currentTarget);
    onBlur?.(event);
  }

  function handleChange(event) {
    /* Clear previous custom validity before checking again */
    event.currentTarget.setCustomValidity("");

    if (touched) {
      validate(event.currentTarget);
    }

    onChange?.(event);
  }

  function handleInvalid(event) {
    /* Show an inline message instead of the browser popup */
    event.preventDefault();
    setTouched(true);
    event.currentTarget.setCustomValidity("");
    validate(event.currentTarget);
    onInvalid?.(event);
  }

  return (
    <div
      className={`
        flex min-w-0 flex-col gap-related
        font-the-one text-dark-humor
        ${className}
      `}
    >
      {/* Search keeps its accessible label visually hidden */}
      <label
        htmlFor={inputId}
        className={variant === "search" ? "sr-only" : "text-small"}
      >
        {fieldLabel}
      </label>

      <div className="flex items-center gap-related">
        <input
          {...defaults}
          {...inputProps}
          id={inputId}
          onChange={handleChange}
          onBlur={handleBlur}
          onInvalid={handleInvalid}
          aria-invalid={message ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={`
            w-full min-w-0
            p-button rounded-button--icons border
            bg-white font-the-one text-dark-humor
            placeholder:text-dark-humor/70
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-spicy-berry
            disabled:cursor-not-allowed disabled:opacity-50
            ${
              isCalculator
                ? "text-[24px] leading-[1.4] font-normal"
                : "text-body"
            }
            ${
              message
                ? "border-spicy-berry"
                : isCalculator
                  ? "border-rose-fantasy"
                  : "border-transparent"
            }
          `}
        />

        {fieldUnit && (
          <span
            id={`${inputId}-unit`}
            className="shrink-0 text-small"
          >
            {fieldUnit}
          </span>
        )}
      </div>

      {/* Announce validation messages to assistive technology */}
      <p
        id={`${inputId}-error`}
        aria-live="polite"
        className={
          message ? "text-small text-spicy-berry" : "sr-only"
        }
      >
        {message}
      </p>
    </div>
  );
}