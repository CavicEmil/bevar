import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signIn } from "../api/auth";

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
      navigate("/recipes"); // context updates automatically via onAuthStateChange, change to where it navigates to once flow is set in figma
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Im a login</h3>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      <button type="submit" disabled={loading}>
        {loading ? "Logging in…" : "Log in"}
      </button>

      {error && <p role="alert">{error}</p>}

      <p>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </form>
  );
}