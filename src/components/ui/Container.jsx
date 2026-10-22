export default function Container({ className = "", children }) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-spacing-page sm:px-card-sm lg:px-card-lg ${className}`}>
      {children}
    </div>
  );
}

/* this is only to auto align the content of each view */