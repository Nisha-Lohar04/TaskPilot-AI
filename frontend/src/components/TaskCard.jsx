import {
  CalendarDays,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

function TaskCard({ task, onEdit, onDelete }) {
  const priorityClass = task.priority?.toLowerCase() || "medium";
  const statusClass =
    task.status?.toLowerCase().replace(/\s+/g, "-") || "pending";

  return (
    <div className="task-card">
      <div className="task-card-top">
        <div>
          <div className="task-category">
            {task.category || "Other"}
          </div>

          <h3>{task.title}</h3>
        </div>

        <div className="task-actions">
          <button
            className="icon-action-button"
            title="Edit task"
            onClick={() => onEdit(task)}
          >
            <Pencil size={17} />
          </button>

          <button
            className="icon-action-button delete"
            title="Delete task"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <p className="task-description">
        {task.description || "No description provided."}
      </p>

      <div className="task-card-bottom">
        <div className="task-badges">
          <span className={`priority-badge ${priorityClass}`}>
            {task.priority || "Medium"}
          </span>

          <span className={`status-badge ${statusClass}`}>
            {task.status || "Pending"}
          </span>
        </div>

        {task.due_date && (
          <div className="task-date">
            <CalendarDays size={16} />
            <span>
              {new Date(task.due_date).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                }
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;