import React, { useEffect, useState } from "react";
import {
  Palette,
  Bell,
  User,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "system"
  );

  const [notifications, setNotifications] = useState(
    localStorage.getItem("taskNotifications") !== "false"
  );

  const username = localStorage.getItem("username") || "user1.testing";
  const userEmail = localStorage.getItem("email") || "TaskPilot AI User";

  // Apply theme
  useEffect(() => {
    const applyTheme = () => {
      let activeTheme = theme;

      if (theme === "system") {
        activeTheme = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
          ? "dark"
          : "light";
      }

      document.documentElement.setAttribute(
        "data-theme",
        activeTheme
      );
    };

    applyTheme();
    localStorage.setItem("theme", theme);

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemThemeChange = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange
      );
    };
  }, [theme]);

  // Notification preference
  const handleNotificationChange = () => {
    const newValue = !notifications;

    setNotifications(newValue);

    localStorage.setItem(
      "taskNotifications",
      String(newValue)
    );
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    navigate("/");
  };

  const themeOptions = [
    {
      id: "light",
      label: "Light",
      icon: Sun,
    },
    {
      id: "dark",
      label: "Dark",
      icon: Moon,
    },
    {
      id: "system",
      label: "System",
      icon: Monitor,
    },
  ];

  return (
    <>
      <style>{`
        .tp-settings-page {
          width: 100%;
          min-height: 100%;
          padding-bottom: 40px;
          color: var(--text-primary, #1f2937);
        }

        .tp-settings-header {
          margin-bottom: 28px;
        }

        .tp-settings-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: #5b5bd6;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .tp-settings-header h1 {
          margin: 0;
          font-size: 34px;
          line-height: 1.2;
          font-weight: 700;
          letter-spacing: -0.8px;
          color: var(--text-primary, #1f2937);
        }

        .tp-settings-header h1 span {
          color: #5b5bd6;
        }

        .tp-settings-header p {
          margin: 10px 0 0;
          color: var(--text-secondary, #6b7280);
          font-size: 15px;
        }

        .tp-settings-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 1000px;
        }

        .tp-settings-card {
          width: 100%;
          padding: 26px;
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--border-color, #e7e9f0);
          border-radius: 18px;
          box-sizing: border-box;
        }

        .tp-settings-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .tp-settings-icon {
          width: 56px;
          height: 56px;
          min-width: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: rgba(91, 91, 214, 0.12);
          color: #5b5bd6;
        }

        .tp-settings-title h2 {
          margin: 0 0 6px;
          color: var(--text-primary, #1f2937);
          font-size: 22px;
          font-weight: 700;
        }

        .tp-settings-title p {
          margin: 0;
          color: var(--text-secondary, #6b7280);
          font-size: 14px;
        }

        /* APPEARANCE */

        .tp-theme-options {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .tp-theme-option {
          position: relative;
          min-height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 18px;
          border: 1px solid var(--border-color, #e7e9f0);
          border-radius: 12px;
          background: var(--input-bg, #f8fafc);
          color: var(--text-primary, #1f2937);
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tp-theme-option:hover {
          border-color: #6b5ce7;
          transform: translateY(-1px);
        }

        .tp-theme-option.active {
          border-color: #5b5bd6;
          background: rgba(91, 91, 214, 0.10);
          color: #5b5bd6;
        }

        .tp-theme-check {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #5b5bd6;
          color: white;
        }

        /* NOTIFICATIONS */

        .tp-settings-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-top: 4px;
        }

        .tp-settings-row-content h3 {
          margin: 0 0 6px;
          color: var(--text-primary, #1f2937);
          font-size: 17px;
          font-weight: 700;
        }

        .tp-settings-row-content p {
          margin: 0;
          color: var(--text-secondary, #6b7280);
          font-size: 14px;
          line-height: 1.5;
        }

        .tp-switch {
          position: relative;
          width: 52px;
          height: 28px;
          min-width: 52px;
          border: none;
          border-radius: 20px;
          padding: 0;
          background: #cbd5e1;
          cursor: pointer;
          transition: background 0.25s ease;
        }

        .tp-switch.active {
          background: #5b5bd6;
        }

        .tp-switch-circle {
          position: absolute;
          top: 4px;
          left: 4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.15);
          transition: transform 0.25s ease;
        }

        .tp-switch.active .tp-switch-circle {
          transform: translateX(24px);
        }

        /* ACCOUNT */

        .tp-account-info {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .tp-account-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 15px 0;
          border-bottom: 1px solid var(--border-color, #e7e9f0);
        }

        .tp-account-row:last-child {
          border-bottom: none;
        }

        .tp-account-label {
          color: var(--text-secondary, #6b7280);
          font-size: 14px;
        }

        .tp-account-value {
          color: var(--text-primary, #1f2937);
          font-size: 15px;
          font-weight: 600;
          text-align: right;
          word-break: break-word;
        }

        /* SESSION */

        .tp-session-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .tp-session-content p {
          margin: 0;
          color: var(--text-secondary, #6b7280);
          font-size: 14px;
          line-height: 1.5;
        }

        .tp-logout-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 44px;
          padding: 10px 18px;
          border: 1px solid #fecaca;
          border-radius: 10px;
          background: #fff1f2;
          color: #dc2626;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .tp-logout-button:hover {
          background: #fee2e2;
          transform: translateY(-1px);
        }

        /* DARK MODE */

        [data-theme="dark"] .tp-settings-card {
          background: var(--card-bg, #1f2937);
        }

        [data-theme="dark"] .tp-theme-option {
          background: var(--input-bg, #111827);
        }

        [data-theme="dark"] .tp-theme-option.active {
          background: rgba(91, 91, 214, 0.20);
        }

        [data-theme="dark"] .tp-logout-button {
          background: rgba(220, 38, 38, 0.12);
          border-color: rgba(220, 38, 38, 0.35);
        }

        /* RESPONSIVE */

        @media (max-width: 700px) {
          .tp-settings-page {
            padding-bottom: 25px;
          }

          .tp-settings-header h1 {
            font-size: 28px;
          }

          .tp-settings-card {
            padding: 20px;
          }

          .tp-theme-options {
            grid-template-columns: 1fr;
          }

          .tp-settings-row,
          .tp-session-content {
            align-items: flex-start;
            flex-direction: column;
          }

          .tp-switch {
            align-self: flex-start;
          }

          .tp-logout-button {
            width: 100%;
          }

          .tp-account-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 6px;
          }

          .tp-account-value {
            text-align: left;
          }
        }
      `}</style>

      <div className="tp-settings-page">
        {/* PAGE HEADER */}

        <div className="tp-settings-header">
          <div className="tp-settings-label">
            <Palette size={15} />
            SETTINGS
          </div>

          <h1>
            Workspace <span>Settings</span>
          </h1>

          <p>
            Manage your preferences and customize your TaskPilot AI workspace.
          </p>
        </div>

        <div className="tp-settings-container">

          {/* APPEARANCE */}

          <section className="tp-settings-card">
            <div className="tp-settings-card-header">
              <div className="tp-settings-icon">
                <Palette size={26} />
              </div>

              <div className="tp-settings-title">
                <h2>Appearance</h2>
                <p>Choose how TaskPilot AI looks.</p>
              </div>
            </div>

            <div className="tp-theme-options">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.id;

                return (
                  <button
                    key={option.id}
                    className={`tp-theme-option ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => setTheme(option.id)}
                  >
                    <Icon size={21} />

                    {option.label}

                    {isActive && (
                      <span className="tp-theme-check">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* NOTIFICATIONS */}

          <section className="tp-settings-card">
            <div className="tp-settings-card-header">
              <div className="tp-settings-icon">
                <Bell size={26} />
              </div>

              <div className="tp-settings-title">
                <h2>Notifications</h2>
                <p>Control workspace notifications.</p>
              </div>
            </div>

            <div className="tp-settings-row">
              <div className="tp-settings-row-content">
                <h3>Task Notifications</h3>

                <p>
                  Receive notifications about task updates and activity.
                </p>
              </div>

              <button
                className={`tp-switch ${
                  notifications ? "active" : ""
                }`}
                onClick={handleNotificationChange}
                aria-label="Toggle task notifications"
              >
                <span className="tp-switch-circle" />
              </button>
            </div>
          </section>

          {/* ACCOUNT */}

          <section className="tp-settings-card">
            <div className="tp-settings-card-header">
              <div className="tp-settings-icon">
                <User size={26} />
              </div>

              <div className="tp-settings-title">
                <h2>Account</h2>
                <p>Your TaskPilot AI profile.</p>
              </div>
            </div>

            <div className="tp-account-info">
              <div className="tp-account-row">
                <span className="tp-account-label">Username</span>

                <span className="tp-account-value">
                  {username}
                </span>
              </div>

              <div className="tp-account-row">
                <span className="tp-account-label">Account Type</span>

                <span className="tp-account-value">
                  {userEmail}
                </span>
              </div>
            </div>
          </section>

          {/* SESSION */}

          <section className="tp-settings-card">
            <div className="tp-settings-card-header">
              <div className="tp-settings-icon">
                <LogOut size={26} />
              </div>

              <div className="tp-settings-title">
                <h2>Session</h2>
                <p>Manage your current account session.</p>
              </div>
            </div>

            <div className="tp-session-content">
              <p>
                Signing out will securely end your current TaskPilot AI session.
              </p>

              <button
                className="tp-logout-button"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout from TaskPilot
              </button>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default Settings;