const variants = {
  1: "text-heading-1",
  2: "text-heading-2",
  3: "text-heading-3",
};

export default function Heading({
  content,
  children,
  level = 1,
  variant = 1,
  className = "",
}) {
  const Tag = `h${level}`;

  return (
    <Tag className={`font-the-one ${variants[variant]} ${className}`}>
      {content ?? children}
    </Tag>
  );
}
