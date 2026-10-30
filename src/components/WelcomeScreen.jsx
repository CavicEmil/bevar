import BevarIntro from "./ui/BevarIntro";
import Spinner from "./ui/Spinner";
import logo from "../assets/logo-big.png";

export default function WelcomeScreen({ variant = "animated", label = "Loading Bevar…" }) {
  return (
    <div className={
      variant === "classic" || variant === "animated"
        ? "flex min-h-[100dvh] w-full flex-col items-center justify-center gap-related bg-dark-humor"
        : "w-full"          // inline: no full-screen shell, no dark bg — the page chrome shows around it
    }>
      {variant === "classic" ? (
        <>
          <img src={logo} alt="Bevar" className="w-[200px]" />
          <Spinner />
        </>
      ) : variant === "animated" ? (
        <>
          <div className="w-[100dvw] max-w-full">
            <BevarIntro />
          </div>
          <span role="status" className="sr-only">Loading Bevar…</span>
        </>
      ) : (
        <>
          <BevarIntro variant="inline" />
          <span role="status" className="sr-only">{label}</span>
        </>
      )}
    </div>
  );
}