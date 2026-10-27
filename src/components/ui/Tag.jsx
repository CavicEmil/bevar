/* was necessary for Recipe & ArticleCard */

export default function Tag({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-[5px] text-small text-dark-humor">
      {icon && (
        <img src={icon} alt="" aria-hidden="true" className="h-[14px] w-[14px]" />
      )}
      {label}
    </span>
  );
}