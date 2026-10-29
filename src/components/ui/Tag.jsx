/* was necessary for Recipe & ArticleCard */

export default function Tag({ icon, label, iconColor }) {
  return (
    <span className="inline-flex items-center gap-[5px] text-small text-dark-humor">
      {icon && iconColor ? (
        <span
          aria-hidden="true"
          className="h-[14px] w-[14px] shrink-0"
          style={{
            backgroundColor: iconColor,
            maskImage: `url("${icon}")`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
      ) : icon ? (
        <img src={icon} alt="" aria-hidden="true" className="h-[14px] w-[14px]" />
      ) : null}
      {label}
    </span>
  );
}
