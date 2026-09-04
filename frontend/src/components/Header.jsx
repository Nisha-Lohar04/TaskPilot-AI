import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

function Header({
  onMenuClick,
  onSearch,
}) {
  const username =
    localStorage.getItem("username") ||
    "User";

  const initial =
    username.charAt(0).toUpperCase();

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
        >
          <Menu size={23} />
        </button>

        <div className="header-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search tasks..."
            onChange={(e) =>
              onSearch?.(e.target.value)
            }
          />
        </div>
      </div>

      <div className="header-right">
        <button className="notification-button">
          <Bell size={19} />

          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            {initial}
          </div>

          <div className="user-details">
            <strong>{username}</strong>

            <span>TaskPilot User</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;