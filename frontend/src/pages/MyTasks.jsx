import { useEffect, useMemo, useState } from "react";

import {
  CheckSquare,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import api from "../api/axios";

import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

function MyTasks() {
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [isTaskFormOpen, setIsTaskFormOpen] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tasks/");

      setTasks(response.data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load your tasks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        task.title.toLowerCase().includes(searchText) ||
        (task.description || "")
          .toLowerCase()
          .includes(searchText) ||
        task.category
          .toLowerCase()
          .includes(searchText);

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [
    tasks,
    search,
    priorityFilter,
    statusFilter,
  ]);

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

  const handleUpdateTask = async (taskData) => {
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

  const handleSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  return (
    <div className="my-tasks-page">
      <section className="page-heading">
        <div>
          <p className="welcome-label">
            <CheckSquare size={17} />
            TASK MANAGEMENT
          </p>

          <h1>My Tasks</h1>

          <p>
            Organize, filter, and manage all your tasks
            in one place.
          </p>
        </div>

        <button
          className="create-task-button"
          onClick={() => {
            setEditingTask(null);
            setIsTaskFormOpen(true);
          }}
        >
          <Plus size={20} />
          Create Task
        </button>
      </section>

      <section className="task-toolbar">
        <div className="task-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="filter-group">
          <SlidersHorizontal size={18} />

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
          >
            <option value="All">
              All Priorities
            </option>

            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>

            <option value="Critical">
              Critical
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Statuses
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>
        </div>
      </section>

      <p className="task-count">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </p>

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
        filteredTasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <CheckSquare size={34} />
            </div>

            <h3>No tasks found</h3>

            <p>
              Try changing your filters or create a new
              task.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        filteredTasks.length > 0 && (
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(task) => {
                  setEditingTask(task);
                  setIsTaskFormOpen(true);
                }}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
        editingTask={editingTask}
      />
    </div>
  );
}

export default MyTasks;