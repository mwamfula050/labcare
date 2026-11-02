
import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { api, setCredentials, clearCredentials } from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      setCredentials(username.trim(), password);

      // Verify credentials using an endpoint accessible to all roles.
      await api("/patients");

      onLogin(username.trim());
    } catch (err) {
      clearCredentials();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="brand-mark">
          <FlaskConical size={27} />
        </div>

        <div className="eyebrow">LABCARE WORKSPACE</div>

        <h1>Welcome Back</h1>

        <p className="muted">
          Sign in to access your laboratory management system.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </label>

          <button
            type="submit"
            className="primary full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {error && <div className="error">{error}</div>}
        </form>

        <small>
          LabCare Laboratory Management System.
          Keep your login credentials confidential.
        </small>
      </div>
    </div>
  );
}
