import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  title: "",
  description: "",
  priority: "Medium",
  category: "Other",
  status: "Pending",
  due_date: "",
};

function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
}) {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        priority: editingTask.priority || "Medium",
        category: editingTask.category || "Other",
        status: editingTask.status || "Pending",
        due_date: editingTask.due_date || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...formData,
      due_date: formData.due_date || null,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="task-modal">
        <div className="modal-header">
          <div>
            <h2>
              {editingTask ? "Edit Task" : "Create New Task"}
            </h2>

            <p>
              {editingTask
                ? "Update your task details."
                : "Add a new task to your workspace."}
            </p>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="task-form-group">
            <label>Task Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="task-form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the task"
              rows="4"
            />
          </div>

          <div className="task-form-row">
            <div className="task-form-group">
              <label>Priority</label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>

            <div className="task-form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <div className="task-form-row">
            <div className="task-form-group">
              <label>Category</label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Development"
              />
            </div>

            <div className="task-form-group">
              <label>Due Date</label>

              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              {editingTask
                ? "Save Changes"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;