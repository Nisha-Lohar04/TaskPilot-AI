import { useEffect, useState } from "react";

import {
  CheckCircle2,
  Clock3,
  ListTodo,
  Plus,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import api from "../api/axios";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

import MyTasks from "./MyTasks";
import AIAssistant from "./AIAssistant";
import Analytics from "./Analytics";
import Settings from "./Settings";

function Dashboard({
  activePage,
  setActivePage,
  onLogout,
  theme,
  setTheme,
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const username =
    localStorage.getItem("username") || "there";

  // =========================
  // FETCH TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tasks/");

      setTasks(response.data);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else {
        setError(
          "Unable to load tasks. Please make sure the backend server is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================
  // CREATE TASK
  // =========================

  const handleCreateTask = async (taskData) => {
    try {
      await api.post("/tasks/", taskData);

      setIsTaskFormOpen(false);

      await fetchTasks();
    } catch (err) {
      console.error(err);

      alert("Unable to create task.");
    }
  };

  // =========================
  // UPDATE TASK
  // =========================

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;

    try {
      await api.put(
        `/tasks/${editingTask.id}`,
        taskData
      );

      setEditingTask(null);
      setIsTaskFormOpen(false);

      await fetchTasks();
    } catch (err) {
      console.error(err);

      alert("Unable to update task.");
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${taskId}`);

      await fetchTasks();
    } catch (err) {
      console.error(err);

      alert("Unable to delete task.");
    }
  };

  // =========================
  // TASK FORM
  // =========================

  const handleTaskSubmit = async (taskData) => {
    if (editingTask) {
      await handleUpdateTask(taskData);
    } else {
      await handleCreateTask(taskData);
    }
  };

  const openCreateTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  // =========================
  // TASK STATISTICS
  // =========================

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  // =========================
  // SEARCH
  // =========================

  const filteredDashboardTasks = tasks.filter(
    (task) => {
      const query = searchQuery
        .trim()
        .toLowerCase();

      if (!query) return true;

      return (
        task.title
          .toLowerCase()
          .includes(query) ||
        (task.description || "")
          .toLowerCase()
          .includes(query) ||
        (task.category || "")
          .toLowerCase()
          .includes(query) ||
        (task.priority || "")
          .toLowerCase()
          .includes(query) ||
        (task.status || "")
          .toLowerCase()
          .includes(query)
      );
    }
  );

  // =========================
  // DASHBOARD PAGE
  // =========================

  const renderDashboard = () => (
    <>
      <section className="dashboard-welcome">
        <div>
          <p className="welcome-label">
            <Sparkles size={17} />
            AI-POWERED PRODUCTIVITY
          </p>

          <h1>
            Good to see you,{" "}
            <span>{username}</span>
          </h1>

          <p>
            Organize your work, focus on what matters,
            and let TaskPilot AI help you stay productive.
          </p>
        </div>

        <button
          className="create-task-button"
          onClick={openCreateTask}
        >
          <Plus size={20} />
          Create Task
        </button>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <ListTodo size={22} />
          </div>

          <div>
            <span>Total Tasks</span>
            <h3>{totalTasks}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock3 size={22} />
          </div>

          <div>
            <span>Pending</span>
            <h3>{pendingTasks}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon progress">
            <AlertCircle size={22} />
          </div>

          <div>
            <span>In Progress</span>
            <h3>{inProgressTasks}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span>Completed</span>
            <h3>{completedTasks}</h3>
          </div>
        </div>
      </section>

      <section className="tasks-section">
        <div className="section-header">
          <div>
            <h2>Your Tasks</h2>

            <p>
              Manage and track your current work.
            </p>
          </div>

          <button
            className="text-button"
            onClick={() =>
              setActivePage("My Tasks")
            }
          >
            View All
          </button>
        </div>

        {loading && (
          <div className="dashboard-message">
            Loading your tasks...
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          filteredDashboardTasks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <ListTodo size={34} />
              </div>

              <h3>
                {searchQuery
                  ? "No tasks found"
                  : "No tasks yet"}
              </h3>

              <p>
                {searchQuery
                  ? "Try searching with different keywords."
                  : "Create your first task and start organizing your work."}
              </p>

              {!searchQuery && (
                <button
                  className="create-task-button"
                  onClick={openCreateTask}
                >
                  <Plus size={19} />
                  Create Your First Task
                </button>
              )}
            </div>
          )}

        {!loading &&
          !error &&
          filteredDashboardTasks.length > 0 && (
            <div className="tasks-grid">
              {filteredDashboardTasks
                .slice(0, 6)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={openEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
            </div>
          )}
      </section>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        editingTask={editingTask}
      />
    </>
  );

  // =========================
  // PAGE ROUTING
  // =========================

  const renderPage = () => {
    switch (activePage) {
      case "My Tasks":
        return (
          <MyTasks
            refreshTasks={fetchTasks}
          />
        );

      case "AI Assistant":
        return <AIAssistant />;

      case "Analytics":
        return <Analytics />;

      case "Settings":
        return (
          <Settings
            theme={theme}
            setTheme={setTheme}
            onLogout={onLogout}
          />
        );

      default:
        return renderDashboard();
    }
  };

  // Pages that should have internal scrolling
  const scrollablePages = [
    "Dashboard",
    "Analytics",
    "Settings",
  ];

  const isScrollable =
    activePage === "Dashboard" ||
    activePage === "Analytics" ||
    activePage === "Settings";

  return (
    <div className="dashboard-page">
      <div
        className={`sidebar-wrapper ${
          isSidebarOpen ? "open" : ""
        }`}
      >
        <Sidebar
          activePage={activePage}
          onNavigate={(page) => {
            setActivePage(page);
            setSearchQuery("");
            setIsSidebarOpen(false);
          }}
          onLogout={onLogout}
          theme={theme}
          setTheme={setTheme}
        />
      </div>

      <main className="dashboard-main">
        <Header
          onMenuClick={() =>
            setIsSidebarOpen(!isSidebarOpen)
          }
          onSearch={setSearchQuery}
        />

        <div
          className={`dashboard-content ${
            isScrollable
              ? "page-scroll-enabled"
              : "page-scroll-disabled"
          }`}
        >
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;