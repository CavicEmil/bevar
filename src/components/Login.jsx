import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { signIn } from "../api/auth";
import Input from "./ui/Input";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const from = location.state?.from;
  const destination = typeof from === "string" && from.startsWith("/") && !from.startsWith("//") && from !== "/login" && from !== "/signup"
    ? from
    : "/profile";

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [authLoading, isAuthenticated, destination, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading || authLoading) return;
    setError(null);
    setLoading(true);

    try {
      const data = await signIn(email.trim(), password);
      if (!data.session) throw new Error("Could not start your session. Please try again.");
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || isAuthenticated) {
    return <p role="status" className="p-page text-body text-white">{authLoading ? "Checking your session…" : "Opening your profile…"}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={loading}
      className="
        mx-auto flex min-h-[calc(100dvh-80px)] w-full max-w-lg
        flex-col gap-section rounded-t-[28px] bg-rose-fantasy px-page pt-[28px] pb-[40px]
        font-the-one text-dark-humor
      "
    >
      <div className="mb-section flex flex-col gap-related">
        <h1 className="text-heading-2">
          Welcome back
        </h1>

        <p className="text-body">
          Log in to your account.
        </p>
      </div>

      <div className="flex flex-col gap-related">
        <Input
          variant="email"
          id="login-email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
        />

        <Input
          variant="name"
          id="login-password"
          label="Password"
          name="password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          onInvalid={() => {
            setError("Please enter your password.");
          }}
          required
        />
      </div>

      {error && (
        <p role="alert" className="text-small text-spicy-berry">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="
          flex min-h-[48px] w-full
          items-center justify-center
          rounded-button--icons bg-spicy-berry p-button
          text-body font-semibold text-white
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-spicy-berry
          disabled:cursor-not-allowed disabled:opacity-50
        "
      >
        {loading ? "Logging in…" : "Log in"}
      </button>

      <div className="flex flex-col gap-related text-center">
        <Link
          to="/signup"
          className="
            flex min-h-[48px] w-full items-center justify-center
            rounded-button--icons bg-white p-button
            text-body font-semibold text-dark-humor
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-spicy-berry
          "
        >
          No account yet? Sign up
        </Link>
        <Link
          to="/"
          className="flex min-h-[48px] w-full items-center justify-center rounded-button--icons p-button text-body font-semibold text-dark-humor focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spicy-berry"
        >
          Keep exploring as a guest
        </Link>
      </div>
    </form>
  );
}
