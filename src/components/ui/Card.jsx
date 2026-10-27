const surfaces = {
  default:  "bg-white border-neutral-200",
  viewbg:   "bg-rose-fantasy border-transparent rounded-t-card !rounded-b-none min-h-screen p-4",
  hero:     "bg-white border-neutral-200 shadow-md",
  profileA: "bg-poplar-pink border-transparent",
  profileB: "bg-dark-humor border-transparent text-rose-fantasy",
  fruit:    "bg-rose-fantasy border-transparent",
};
const sizes = {
  lg: "p-[--spacing-card-lg]",
  sm: "p-[--spacing-card-sm]",
};
const radius = "rounded-card";

export default function Card({ variant = "default", size = "lg", className = "", children }) {
  return (
    <div className={`${radius} ${surfaces[variant]} ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}
