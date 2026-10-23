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
    placeholder: "Password",
    autoComplete: "new-password",
    minLength: 8,
    pattern: "(?=.*[0-9])(?=.*[^A-Za-z0-9\\s]).{8,}",
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

/* Password feedback is handled by the requirements checklist */
function getValidationMessage(input) {
  if (input.type === "password") {
    return "";
  }

  const { validity } = input;

  if (validity.badInput) {
    return "Please enter a valid number.";
  }

  if (
    validity.valueMissing ||
    (input.required && input.type === "text" && !input.value.trim())
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
  const [currentValue, setCurrentValue] = useState(
    inputProps.defaultValue ?? ""
  );

  const {
    label: defaultLabel,
    ...defaults
  } = variants[variant] || variants.name;

  const isCalculator = variant === "calculator";
  const isPassword = variant === "password";

  const fieldLabel = label ?? defaultLabel;
  const fieldUnit = unit ?? (isCalculator ? "g" : undefined);
  const value = String(inputProps.value ?? currentValue);

  /* Update each password requirement while typing */
  const requirements = [
    {
      label: "At least 8 characters",
      met: value.length >= 8,
    },
    {
      label: "At least 1 number",
      met: /[0-9]/.test(value),
    },
    {
      label: "At least 1 special character",
      met: /[^A-Za-z0-9\s]/.test(value),
    },
  ];

  const passwordIsValid = requirements.every(
    (requirement) => requirement.met
  );

  /* Also reveal requirements if an empty password is submitted */
  const showRequirements = isPassword && (value.length > 0 || touched);

  /* External errors can still be supplied by the page */
  const message = error || validationError;

  const isInvalid =
    Boolean(message) ||
    (isPassword && touched && !passwordIsValid);

  const describedBy = [
    fieldUnit ? `${inputId}-unit` : null,
    showRequirements ? `${inputId}-requirements` : null,
    message ? `${inputId}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");

  function validate(input) {
    const message = getValidationMessage(input);

    /* Native password constraints still prevent invalid submission */
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
    setCurrentValue(event.currentTarget.value);

    /* Clear previous custom validity before checking again */
    event.currentTarget.setCustomValidity("");

    if (touched) {
      validate(event.currentTarget);
    }

    onChange?.(event);
  }

  function handleInvalid(event) {
    /* Suppress the browser popup and use inline feedback */
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
          aria-invalid={isInvalid || undefined}
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

      {/* Each checkmark turns green when its requirement is met */}
      {showRequirements && (
        <ul
          id={`${inputId}-requirements`}
          className="flex list-none flex-col gap-1 text-small"
        >
          {requirements.map(({ label, met }) => (
            <li
              key={label}
              className={`
                flex items-center gap-2
                ${met ? "text-green-700" : "text-dark-humor/50"}
              `}
            >
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="shrink-0"
              >
                <path
                  d="M2.5 7L5.5 10L11.5 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>
                {label}
                <span className="sr-only">
                  {met ? " — met" : " — not met"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Announce other validation messages to assistive technology */}
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