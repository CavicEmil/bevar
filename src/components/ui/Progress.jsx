export default function Progress({ value = 0, max = 1, label }) {
  return (
    <progress
      value={value}
      max={max}
      aria-label={label}
      className="block h-1 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-white [&::-webkit-progress-value]:bg-spicy-berry [&::-moz-progress-bar]:bg-spicy-berry"
    />
  );
}
