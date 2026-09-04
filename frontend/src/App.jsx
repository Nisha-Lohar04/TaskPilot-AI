import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import "./App.css";

function App() {
  const [page, setPage] = useState(
    localStorage.getItem("access_token")
      ? "dashboard"
      : "login"
  );

  const [activePage, setActivePage] =
    useState("Dashboard");

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogin = () => {
    setActivePage("Dashboard");
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");

    setActivePage("Dashboard");
    setPage("login");
  };

  if (page === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setPage("register")}
      />
    );
  }

  if (page === "register") {
    return (
      <Register
        onLogin={() => setPage("login")}
      />
    );
  }

  return (
    <Dashboard
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={handleLogout}
      theme={theme}
      setTheme={setTheme}
    />
  );
}

export default App;