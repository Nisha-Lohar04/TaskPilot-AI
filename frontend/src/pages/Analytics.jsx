import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ListTodo,
  TrendingUp,
} from "lucide-react";

import api from "../api/axios";

function Analytics() {
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response =
          await api.get("/tasks/");

        setTasks(response.data);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const analytics = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(
      (task) =>
        task.status === "Completed"
    ).length;

    const pending = tasks.filter(
      (task) =>
        task.status === "Pending"
    ).length;

    const inProgress = tasks.filter(
      (task) =>
        task.status === "In Progress"
    ).length;

    const completionRate =
      total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
          );

    const priorityCounts = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    };

    tasks.forEach((task) => {
      if (
        Object.prototype.hasOwnProperty.call(
          priorityCounts,
          task.priority
        )
      ) {
        priorityCounts[task.priority]++;
      }
    });

    const categoryCounts = {};

    tasks.forEach((task) => {
      const category =
        task.category || "Other";

      categoryCounts[category] =
        (categoryCounts[category] || 0) + 1;
    });

    return {
      total,
      completed,
      pending,
      inProgress,
      completionRate,
      priorityCounts,
      categoryCounts,
    };
  }, [tasks]);

  if (loading) {
    return (
      <div className="dashboard-message">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        {error}
      </div>
    );
  }

  const maxPriority = Math.max(
    ...Object.values(
      analytics.priorityCounts
    ),
    1
  );

  const maxCategory = Math.max(
    ...Object.values(
      analytics.categoryCounts
    ),
    1
  );

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="welcome-label">
            <BarChart3 size={17} />
            PRODUCTIVITY INSIGHTS
          </p>

          <h1>Analytics</h1>

          <p>
            Understand your productivity and task
            progress.
          </p>
        </div>
      </section>

      <section className="analytics-stats-grid">
        <div className="analytics-card">
          <ListTodo size={23} />

          <div>
            <span>Total Tasks</span>

            <h2>{analytics.total}</h2>
          </div>
        </div>

        <div className="analytics-card">
          <CheckCircle2 size={23} />

          <div>
            <span>Completed</span>

            <h2>{analytics.completed}</h2>
          </div>
        </div>

        <div className="analytics-card">
          <Clock3 size={23} />

          <div>
            <span>Pending</span>

            <h2>{analytics.pending}</h2>
          </div>
        </div>

        <div className="analytics-card">
          <TrendingUp size={23} />

          <div>
            <span>Completion Rate</span>

            <h2>
              {analytics.completionRate}%
            </h2>
          </div>
        </div>
      </section>

      <section className="analytics-layout">
        <div className="analytics-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>Task Status</h2>

              <p>
                Overview of your current workload.
              </p>
            </div>
          </div>

          <div className="status-overview">
            <div className="status-row">
              <span>
                <Clock3 size={17} />
                Pending
              </span>

              <strong>
                {analytics.pending}
              </strong>
            </div>

            <div className="status-row">
              <span>
                <AlertCircle size={17} />
                In Progress
              </span>

              <strong>
                {analytics.inProgress}
              </strong>
            </div>

            <div className="status-row">
              <span>
                <CheckCircle2 size={17} />
                Completed
              </span>

              <strong>
                {analytics.completed}
              </strong>
            </div>
          </div>
        </div>

        <div className="analytics-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>Priority Distribution</h2>

              <p>
                Tasks grouped by importance.
              </p>
            </div>
          </div>

          <div className="bar-chart">
            {Object.entries(
              analytics.priorityCounts
            ).map(([priority, count]) => (
              <div
                className="bar-item"
                key={priority}
              >
                <div className="bar-label">
                  <span>{priority}</span>

                  <strong>{count}</strong>
                </div>

                <div className="bar-track">
                  <div
                    className={`bar-fill ${priority.toLowerCase()}`}
                    style={{
                      width: `${
                        (count / maxPriority) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="analytics-panel category-panel">
        <div className="analytics-panel-header">
          <div>
            <h2>Tasks by Category</h2>

            <p>
              See where your work is concentrated.
            </p>
          </div>
        </div>

        {Object.keys(
          analytics.categoryCounts
        ).length === 0 ? (
          <div className="analytics-empty">
            No task data available yet.
          </div>
        ) : (
          <div className="category-chart">
            {Object.entries(
              analytics.categoryCounts
            ).map(([category, count]) => (
              <div
                className="category-item"
                key={category}
              >
                <div className="category-info">
                  <span>{category}</span>

                  <strong>{count} tasks</strong>
                </div>

                <div className="bar-track">
                  <div
                    className="bar-fill category"
                    style={{
                      width: `${
                        (count / maxCategory) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Analytics;