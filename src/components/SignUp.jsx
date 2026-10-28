import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signUp } from "../api/auth";
import Input from "./ui/Input";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading || submitted) return;

    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your name and surname.");
      return;
    }

    setLoading(true);

    try {
      const data = await signUp(email.trim(), password, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });

      if (data.session) {
        navigate("/recipes");
      } else {
        setSubmitted(true);
        setPassword("");
      }
    } catch (err) {
      setError(
        err.message || "Unable to create an account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Create an account"
      aria-busy={loading}
      className="
        mx-auto flex w-full max-w-[420px]
        flex-col gap-section rounded-card bg-white px-page py-section
        font-the-one text-dark-humor
      "
    >
      {submitted ? (
        <div
          role="status"
          className="flex flex-col gap-related"
        >
          <h1 className="text-[24px] leading-[1.3] font-semibold">
            Check your email
          </h1>

          <p className="text-body">
            If confirmation is needed, follow the link in
            your email to continue. If you already have an
            account, log in below.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-[20px]">
            <Input
              variant="name"
              id="signup-first-name"
              value={firstName}
              disabled={loading}
              onChange={(e) => {
                setFirstName(e.target.value);
                setError(null);
              }}
            />

            <Input
              variant="surname"
              id="signup-last-name"
              value={lastName}
              disabled={loading}
              onChange={(e) => {
                setLastName(e.target.value);
                setError(null);
              }}
            />

            <Input
              variant="email"
              id="signup-email"
              value={email}
              disabled={loading}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
            />

            <Input
              variant="password"
              id="signup-password"
              placeholder="At least 8 characters"
              value={password}
              disabled={loading}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
            />
          </div>

          <p className="text-small">
            By creating an account, you agree to our{" "}
            <span className="text-spicy-berry">
              Terms of use and Privacy policy.
            </span>
          </p>

          {error && (
            <p
              role="alert"
              className="text-small text-spicy-berry"
            >
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </>
      )}

      <div className="flex flex-col gap-related">
        <Link
          to="/login"
          className="
            flex min-h-[48px] w-full
            items-center justify-center
            rounded-button--icons bg-white p-button
            text-center text-body font-semibold
            text-dark-humor no-underline
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-spicy-berry
          "
        >
          Already have an account? Log in
        </Link>

        <Link
          to="/"
          className="
            flex min-h-[48px] w-full
            items-center justify-center p-button
            text-center text-body font-semibold
            text-dark-humor no-underline
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-spicy-berry
          "
        >
          Keep exploring as a guest
        </Link>
      </div>
    </form>
  );
}
