import { useState } from "react";

import {
  Bot,
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import api from "../api/axios";

function Register({ onLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        onLogin();
      }, 1500);

    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Something went wrong. Please try again.";

      setError(message);

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
            Start organizing your work smarter with
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


          <div className="ai-chip">
            AI
          </div>


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

            <h2>Create account</h2>

            <p>
              Start managing your tasks smarter with AI
            </p>

          </div>


          <form onSubmit={handleSubmit}>


            {/* USERNAME */}

            <div className="form-group">

              <label>Username</label>

              <div className="input-wrapper">

                <User size={22} />

                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label>Email</label>

              <div className="input-wrapper">

                <Mail size={22} />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label>Password</label>

              <div className="input-wrapper">

                <LockKeyhole size={22} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />


                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
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


            {/* ERROR MESSAGE */}

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}


            {/* SUCCESS MESSAGE */}

            {success && (
              <div className="auth-success">
                {success}
              </div>
            )}


            {/* BUTTON */}

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >

              {loading
                ? "Creating account..."
                : "Create Account"}

            </button>

          </form>


          {/* FOOTER */}

          <div className="auth-footer">

            Already have an account?{" "}

            <button
              type="button"
              className="auth-link-button"
              onClick={onLogin}
            >
              Sign in
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;