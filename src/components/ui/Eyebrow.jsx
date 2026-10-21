export default function Eyebrow({
  content,
  className = "",
}) {
  return (
    <p className={`font-the-one text-eyebrow text-spicy-berry uppercase ${className}`}>
      {content}
    </p>
  );
}