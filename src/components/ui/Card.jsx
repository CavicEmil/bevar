const surfaces = {
  default:  "bg-white border-neutral-200",
  viewbg:   "bg-poplar-pink border-transparent rounded-t-card",
  hero:     "bg-white border-neutral-200 shadow-md",
  profileA: "bg-poplar-pink border-transparent",
  profileB: "bg-dark-humor border-transparent text-rose-fantasy",
  fruit:    "bg-rose-fantasy border-transparent",
};
const sizes = {
  lg: "p-[--spacing-card-lg]",
  sm: "p-[--spacing-card-sm]",
};
const radius = "rounded-[--radius-card]";

export default function Card({ variant = "default", size = "lg", className = "", children }) {
  return (
    <div className={`${radius} ${surfaces[variant]} ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}