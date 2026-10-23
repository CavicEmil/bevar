import { Link } from "react-router";
import Button from "./ui/Button";
import logo from "../assets/logo-big.png";

export default function Header({
  variant = "logo",
  title = "",
  isGuide = false,
  onBack,
}) {
  return (
    <header className="w-full text-white">
      <div className="flex min-h-20 items-center gap-related px-page py-4 sm:py-5">
        {variant === "logo" ? (
          <Link to="/" aria-label="Go to home" className="inline-flex">
            <img
              src={logo}
              alt="BEVAR"
              className="h-auto w-28 max-w-full sm:w-32"
            />
          </Link>
        ) : (
          <>
            {/* The page defines the back or exit destination */}
            <Button
              variant="ghost"
              icon={isGuide ? "exit" : "back"}
              content={isGuide ? "Exit" : undefined}
              ariaLabel={isGuide ? "Exit guide" : "Go back"}
              onClick={onBack}
              className="shrink-0"
            />

            {/* Display the loaded content title without icons */}
            <span className="min-w-0 flex-1 break-words text-heading-3">
              {title}
            </span>
          </>
        )}
      </div>
    </header>
  );
}