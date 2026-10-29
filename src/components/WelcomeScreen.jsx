import BevarIntro from "./ui/BevarIntro";
import Spinner from "./ui/Spinner";
import logo from "../assets/logo-big.png";

// Keep the original welcome screen available with variant="classic".
export default function WelcomeScreen({ variant = "animated" }) {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-related bg-dark-humor">
      {variant === "classic" ? (
        <>
          <img src={logo} alt="Bevar" className="w-[200px]" />
          <Spinner />
        </>
      ) : (
        <>
          <div className="w-[100dvw] max-w-full">
            <BevarIntro />
          </div>
          <span role="status" className="sr-only">Loading Bevar…</span>
        </>
      )}
    </div>
  );
}
