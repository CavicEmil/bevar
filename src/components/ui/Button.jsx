/* Background and text colours */
const variants = {
  primary: "bg-spicy-berry text-white",
  secondary: "bg-white text-rhodophobia",
  ghost: "bg-transparent text-white",
};

/* SVG paths */
const paths = {
  filter:
    "M2.53846 5.35896H19.4615V7.05126H2.53846V5.35896ZM6.34615 10.718H15.6538V12.4103H6.34615V10.718ZM8.88462 16.0769H13.1154V17.7692H8.88462V16.0769ZM0 0H22V1.69231H0V0Z",

  saved:
    "M2.75 2.75C2.75 2.02065 3.03973 1.32118 3.55546 0.805456C4.07118 0.289731 4.77065 0 5.5 0L16.5 0C17.2293 0 17.9288 0.289731 18.4445 0.805456C18.9603 1.32118 19.25 2.02065 19.25 2.75V21.3125C19.2499 21.4369 19.2161 21.5589 19.1522 21.6655C19.0883 21.7722 18.9966 21.8595 18.887 21.9182C18.7774 21.9769 18.6539 22.0048 18.5296 21.9989C18.4054 21.9929 18.2852 21.9534 18.1816 21.8845L11 18.0139L3.81837 21.8845C3.71484 21.9534 3.59457 21.9929 3.47035 21.9989C3.34613 22.0048 3.22263 21.9769 3.113 21.9182C3.00337 21.8595 2.91171 21.7722 2.84778 21.6655C2.78386 21.5589 2.75006 21.4369 2.75 21.3125V2.75ZM5.5 1.375C5.13533 1.375 4.78559 1.51987 4.52773 1.77773C4.26987 2.03559 4.125 2.38533 4.125 2.75V20.0282L10.6191 16.6155C10.732 16.5404 10.8645 16.5004 11 16.5004C11.1355 16.5004 11.268 16.5404 11.3809 16.6155L17.875 20.0282V2.75C17.875 2.38533 17.7301 2.03559 17.4723 1.77773C17.2144 1.51987 16.8647 1.375 16.5 1.375H5.5Z",

  savedFilled:
    "M1.84069e-07 2.75V21.3125C-8.71665e-05 21.4319 0.0309162 21.5492 0.0899588 21.653C0.149001 21.7568 0.234048 21.8434 0.336726 21.9043C0.439405 21.9652 0.556175 21.9983 0.675544 22.0004C0.794913 22.0025 0.912766 21.9734 1.0175 21.9161L8.25 17.9699L15.4825 21.9161C15.5872 21.9734 15.7051 22.0025 15.8245 22.0004C15.9438 21.9983 16.0606 21.9652 16.1633 21.9043C16.266 21.8434 16.351 21.7568 16.41 21.653C16.4691 21.5492 16.5001 21.4319 16.5 21.3125V2.75C16.5 2.02065 16.2103 1.32118 15.6945 0.805456C15.1788 0.289731 14.4793 0 13.75 0L2.75 0C2.02065 0 1.32118 0.289731 0.805456 0.805456C0.289731 1.32118 1.84069e-07 2.02065 1.84069e-07 2.75Z",

  notifications:
    "M7.19584 18.1958H10.8625M14.5292 6.27918C14.5292 4.82048 13.9497 3.42154 12.9183 2.39009C11.8868 1.35864 10.4879 0.779175 9.02917 0.779175C7.57048 0.779175 6.17154 1.35864 5.14009 2.39009C4.10864 3.42154 3.52917 4.82048 3.52917 6.27918C3.52917 12.6958 0.779175 12.6958 0.779175 14.5292H17.2792C17.2792 12.6958 14.5292 12.6958 14.5292 6.27918Z",

  exit:
    "M7.87778 13.9889L9.44444 15.5556L15 10L9.44444 4.44444L7.87778 6.01111L10.7444 8.88889H0V11.1111H10.7444L7.87778 13.9889ZM17.7778 0H2.22222C1.63285 0 1.06762 0.234126 0.650874 0.650874C0.234126 1.06762 0 1.63285 0 2.22222V6.66667H2.22222V2.22222H17.7778V17.7778H2.22222V13.3333H0V17.7778C0 18.3671 0.234126 18.9324 0.650874 19.3491C1.06762 19.7659 1.63285 20 2.22222 20H17.7778C19 20 20 19 20 17.7778V2.22222C20 1 19 0 17.7778 0Z",
};

export function ButtonIcon({ name, filled = false }) {
  if (name === "back" || name === "next") {
    return (
      <svg
        aria-hidden="true"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        className={`shrink-0 ${name === "next" ? "rotate-180" : ""}`}
      >
        <path
          d="M1 11H21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        <path
          d="M8.5 3.5L1 11L8.5 18.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  const iconName = name === "saved" && filled ? "savedFilled" : name;
  const path = paths[iconName];

  if (!path) return null;

  const dimensions = {
    filter: [22, 18],
    saved: [22, 22],
    savedFilled: [17, 22],
    notifications: [19, 19],
    exit: [20, 20],
  };

  const [width, height] = dimensions[iconName];
  const isBell = iconName === "notifications";

  return (
    <span
      aria-hidden="true"
      className="flex size-[22px] shrink-0 items-center justify-center"
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
      >
        {isBell ? (
          <path
            d={path}
            stroke="currentColor"
            strokeWidth="1.55833"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
        ) : (
          <path d={path} fill="currentColor" />
        )}
      </svg>
    </span>
  );
}

export default function Button({
  content,
  variant = "primary",
  icon,
  iconPosition = "left",
  pressed,
  ariaLabel,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  const iconElement = icon ? (
    <ButtonIcon name={icon} filled={pressed} />
  ) : null;

  const textClasses =
    icon === "exit"
      ? "text-[20px] leading-[1.4] font-semibold"
      : "text-button-big";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      className={`
        bevar-button
        bevar-button--${variant}
        inline-flex min-h-[50px] items-center justify-center
        gap-[10px] p-button rounded-button--icons
        font-the-one whitespace-nowrap border-0
        cursor-pointer
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-current
        disabled:cursor-not-allowed disabled:opacity-50
        ${textClasses}
        ${variants[variant]}
        ${className}
      `}
    >
      {iconPosition === "left" && iconElement}

      {content && <span>{content}</span>}

      {iconPosition === "right" && iconElement}
    </button>
  );
}
