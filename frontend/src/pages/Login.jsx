import { useState } from "react";

import {
  Bot,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import api from "../api/axios";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    // Remove any old invalid login data
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const token = response.data.access_token;

      if (!token) {
        throw new Error("No access token received from server");
      }

      // Save JWT token
      localStorage.setItem("access_token", token);

      // Temporary username for dashboard greeting
      const username = email.split("@")[0];

      localStorage.setItem("username", username);

      // Navigate to dashboard
      if (onLogin) {
        onLogin();
      }
    } catch (err) {
      console.error("Login error:", err);

      localStorage.removeItem("access_token");
      localStorage.removeItem("username");

      setError(
        err.response?.data?.detail ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT SIDE */}
      <div className="auth-brand">
        <div className="brand-top">
          <div className="robot-icon">
            <Bot size={42} strokeWidth={2.2} />
          </div>

          <h1>
            TaskPilot <span>AI</span>
          </h1>

          <p className="brand-description">
            Organize your work smarter with
            <br />
            AI-powered task management.
          </p>

          <div className="brand-features">
            <div className="feature">
              <Sparkles size={22} />
              <span>AI-powered task organization</span>
            </div>

            <div className="feature">
              <Sparkles size={22} />
              <span>Smart priority management</span>
            </div>

            <div className="feature">
              <Sparkles size={22} />
              <span>Stay focused and productive</span>
            </div>
          </div>
        </div>

        {/* DECORATIVE ILLUSTRATION */}
        <div className="task-illustration">
          <div className="floating-circle circle-one"></div>
          <div className="floating-circle circle-two"></div>

          <div className="task-board">
            <div className="clipboard-top"></div>

            <div className="task-line">
              <CheckCircle2 size={22} />
              <div></div>
            </div>

            <div className="task-line">
              <CheckCircle2 size={22} />
              <div></div>
            </div>

            <div className="task-line">
              <CheckCircle2 size={22} />
              <div></div>
            </div>
          </div>

          <div className="ai-chip">AI</div>

          <div className="chat-bubble">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue to TaskPilot AI</p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="form-group">
              <label>Email</label>

              <div className="input-wrapper">
                <Mail size={24} />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Password</label>

              <div className="input-wrapper">
                <LockKeyhole size={24} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={22} />
                  ) : (
                    <Eye size={22} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{" "}

            <button
              type="button"
              className="auth-link-button"
              onClick={onRegister}
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;