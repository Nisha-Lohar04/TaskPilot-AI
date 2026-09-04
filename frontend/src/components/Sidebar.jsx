import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  Bot,
} from "lucide-react";

function Sidebar({
  activePage = "Dashboard",
  onNavigate,
  onLogout,
}) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Tasks",
      icon: CheckSquare,
    },
    {
      name: "AI Assistant",
      icon: Sparkles,
    },
    {
      name: "Analytics",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Bot size={24} />
          </div>

          <div className="logo-text">
            <h2>TaskPilot</h2>
            <span>AI Workspace</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">WORKSPACE</p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => onNavigate(item.name)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}

          <p className="nav-label nav-label-bottom">
            SYSTEM
          </p>

          <button
            className={`nav-item ${
              activePage === "Settings" ? "active" : ""
            }`}
            onClick={() => onNavigate("Settings")}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      <button
        className="logout-button"
        onClick={onLogout}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;