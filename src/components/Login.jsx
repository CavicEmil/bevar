import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signIn } from "../api/auth";
import Input from "./ui/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      navigate("/recipes");
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={loading}
      className="
        mx-auto flex w-full max-w-[420px]
        flex-col gap-section px-page py-section
        font-the-one text-dark-humor
      "
    >
      <div className="flex flex-col gap-related">
        <h1 className="text-[28px] leading-[1.2] font-semibold">
          Welcome back
        </h1>

        <p className="text-body">
          Log in to your account.
        </p>
      </div>

      <div className="flex flex-col gap-[20px]">
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
          rounded-button--icons bg-dark-humor p-button
          text-body font-semibold text-white
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-spicy-berry
          disabled:cursor-not-allowed disabled:opacity-50
        "
      >
        {loading ? "Logging in…" : "Log in"}
      </button>

      <p className="text-center text-small">
        No account?{" "}
        <Link
          to="/signup"
          className="
            font-semibold underline underline-offset-4
            focus-visible:outline-2
            focus-visible:outline-spicy-berry
          "
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}