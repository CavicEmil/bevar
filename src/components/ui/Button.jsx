/* Background and text colours */
const variants = {
  primary: "bg-spicy-berry text-white",
  secondary: "bg-white text-rhodophobia",
  ghost: "bg-transparent text-white",
};

/* Original SVG paths from the prototype */
const paths = {
  filter:
    "M2.53846 5.35896H19.4615V7.05126H2.53846V5.35896ZM6.34615 10.718H15.6538V12.4103H6.34615V10.718ZM8.88462 16.0769H13.1154V17.7692H8.88462V16.0769ZM0 0H22V1.69231H0V0Z",

  heart:
    "M21.4677 5.18454C21.1264 4.39416 20.6342 3.67793 20.0187 3.07596C19.4028 2.47218 18.6766 1.99237 17.8796 1.66261C17.0532 1.31928 16.1668 1.14356 15.2719 1.14565C14.0164 1.14565 12.7915 1.48944 11.727 2.13882C11.4724 2.29416 11.2305 2.46478 11.0013 2.65068C10.7721 2.46478 10.5301 2.29416 10.2755 2.13882C9.21101 1.48944 7.9861 1.14565 6.73063 1.14565C5.82659 1.14565 4.95057 1.31882 4.12293 1.66261C3.3233 1.99366 2.60261 2.46987 1.98379 3.07596C1.36749 3.67725 0.875183 4.39365 0.534783 5.18454C0.180808 6.00708 0 6.88056 0 7.77951C0 8.62752 0.173168 9.51119 0.516957 10.4101C0.804722 11.1614 1.21727 11.9406 1.74441 12.7275C2.57969 13.9728 3.7282 15.2716 5.15429 16.5882C7.51753 18.7706 9.85784 20.2782 9.95716 20.3393L10.5607 20.7264C10.8281 20.897 11.1719 20.897 11.4393 20.7264L12.0428 20.3393C12.1421 20.2756 14.4799 18.7706 16.8457 16.5882C18.2718 15.2716 19.4203 13.9728 20.2556 12.7275C20.7827 11.9406 21.1978 11.1614 21.483 10.4101C21.8268 9.51119 22 8.62752 22 7.77951C22.0025 6.88056 21.8217 6.00708 21.4677 5.18454ZM11.0013 18.712C11.0013 18.712 1.93541 12.9032 1.93541 7.77951C1.93541 5.18454 4.08218 3.08105 6.73063 3.08105C8.59219 3.08105 10.2067 4.12006 11.0013 5.63783C11.7958 4.12006 13.4103 3.08105 15.2719 3.08105C17.9203 3.08105 20.0671 5.18454 20.0671 7.77951C20.0671 12.9032 11.0013 18.712 11.0013 18.712Z",

  heartFilled:
    "M21.4677 4.03891C21.1264 3.24853 20.6342 2.5323 20.0187 1.93033C19.4028 1.32655 18.6766 0.846735 17.8796 0.516976C17.0532 0.173652 16.1668 -0.00206842 15.2719 1.83705e-05C14.0164 1.83705e-05 12.7915 0.343808 11.727 0.993188C11.4724 1.14853 11.2305 1.31915 11.0013 1.50505C10.7721 1.31915 10.5301 1.14853 10.2755 0.993188C9.21101 0.343808 7.9861 1.83705e-05 6.73063 1.83705e-05C5.82659 1.83705e-05 4.95057 0.173186 4.12293 0.516976C3.3233 0.848032 2.60261 1.32424 1.98379 1.93033C1.36749 2.53162 0.875183 3.24802 0.534783 4.03891C0.180808 4.86145 0 5.73493 0 6.63388C0 7.48189 0.173168 8.36556 0.516957 9.2645C0.804722 10.0157 1.21727 10.795 1.74441 11.5819C2.57969 12.8272 3.7282 14.1259 5.15429 15.4425C7.51753 17.625 9.85784 19.1325 9.95716 19.1936L10.5607 19.5807C10.8281 19.7514 11.1719 19.7514 11.4393 19.5807L12.0428 19.1936C12.1421 19.13 14.4799 17.625 16.8457 15.4425C18.2718 14.1259 19.4203 12.8272 20.2556 11.5819C20.7827 10.795 21.1978 10.0157 21.483 9.2645C21.8268 8.36556 22 7.48189 22 6.63388C22.0025 5.73493 21.8217 4.86145 21.4677 4.03891Z",

  notifications:
    "M7.19584 18.1958H10.8625M14.5292 6.27918C14.5292 4.82048 13.9497 3.42154 12.9183 2.39009C11.8868 1.35864 10.4879 0.779175 9.02917 0.779175C7.57048 0.779175 6.17154 1.35864 5.14009 2.39009C4.10864 3.42154 3.52917 4.82048 3.52917 6.27918C3.52917 12.6958 0.779175 12.6958 0.779175 14.5292H17.2792C17.2792 12.6958 14.5292 12.6958 14.5292 6.27918Z",

  exit:
  "M7.87778 13.9889L9.44444 15.5556L15 10L9.44444 4.44444L7.87778 6.01111L10.7444 8.88889H0V11.1111H10.7444L7.87778 13.9889ZM17.7778 0H2.22222C1.63285 0 1.06762 0.234126 0.650874 0.650874C0.234126 1.06762 0 1.63285 0 2.22222V6.66667H2.22222V2.22222H17.7778V17.7778H2.22222V13.3333H0V17.7778C0 18.3671 0.234126 18.9324 0.650874 19.3491C1.06762 19.7659 1.63285 20 2.22222 20H17.7778C19 20 20 19 20 17.7778V2.22222C20 1 19 0 17.7778 0Z",
};

function ButtonIcon({ name, filled = false }) {
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

  const iconName = name === "heart" && filled ? "heartFilled" : name;
  const path = paths[iconName];

  if (!path) return null;

  /* Preserve the original SVG proportions */
  const dimensions = {
    filter: [22, 18],
    heart: [22, 22],
    heartFilled: [22, 20],
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

  /* Exit uses 20px semibold text */
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