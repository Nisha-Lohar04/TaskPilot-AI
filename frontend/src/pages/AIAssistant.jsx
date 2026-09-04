import { useState } from "react";

import {
  Bot,
  Sparkles,
  Send,
  ListTodo,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";

import api from "../api/axios";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const examples = [
    "Show my remaining tasks",
    "Show completed tasks",
    "Show all my tasks",
  ];

  const askAI = async () => {
    const query = message.trim();

    if (!query) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await api.get("/tasks/");
      const tasks = res.data || [];

      const lowerQuery = query.toLowerCase();

      let filteredTasks = [];
      let title = "";
      let description = "";
      let type = "tasks";

      // SHOW COMPLETED TASKS
      if (
        lowerQuery.includes("completed") ||
        lowerQuery.includes("finished") ||
        lowerQuery.includes("done")
      ) {
        filteredTasks = tasks.filter(
          (task) => task.status === "Completed"
        );

        title = "Completed Tasks";

        description = `You have ${filteredTasks.length} completed task${
          filteredTasks.length !== 1 ? "s" : ""
        }.`;

        type = "completed";
      }

      // SHOW REMAINING / PENDING TASKS
      else if (
        lowerQuery.includes("remaining") ||
        lowerQuery.includes("pending") ||
        lowerQuery.includes("left") ||
        lowerQuery.includes("incomplete") ||
        lowerQuery.includes("to do") ||
        lowerQuery.includes("todo")
      ) {
        filteredTasks = tasks.filter(
          (task) => task.status !== "Completed"
        );

        title = "Remaining Tasks";

        description = `You have ${filteredTasks.length} task${
          filteredTasks.length !== 1 ? "s" : ""
        } remaining to complete.`;

        type = "remaining";
      }

      // SHOW IN PROGRESS TASKS
      else if (
        lowerQuery.includes("progress") ||
        lowerQuery.includes("working on")
      ) {
        filteredTasks = tasks.filter(
          (task) => task.status === "In Progress"
        );

        title = "Tasks In Progress";

        description = `You currently have ${filteredTasks.length} task${
          filteredTasks.length !== 1 ? "s" : ""
        } in progress.`;

        type = "progress";
      }

      // SHOW ALL TASKS
      else if (
        lowerQuery.includes("all") ||
        lowerQuery.includes("show my tasks") ||
        lowerQuery.includes("list my tasks")
      ) {
        filteredTasks = tasks;

        title = "All Your Tasks";

        description = `You currently have ${tasks.length} total task${
          tasks.length !== 1 ? "s" : ""
        }.`;

        type = "all";
      }

      // CREATE TASK REQUEST
      else if (
        lowerQuery.includes("create task") ||
        lowerQuery.includes("add task") ||
        lowerQuery.startsWith("create ") ||
        lowerQuery.startsWith("add ")
      ) {
        title = "Create Task Request";

        description =
          "I understand that you want to create a task. Please use the Create Task button so you can provide the task details properly.";

        filteredTasks = [];

        type = "create";
      }

      // GENERAL RESPONSE
      else {
        title = "I can help you with your tasks";

        description =
          "Try asking me things like: Show my remaining tasks, Show completed tasks, Show all my tasks, or What tasks are in progress.";

        filteredTasks = [];

        type = "help";
      }

      setResponse({
        title,
        description,
        tasks: filteredTasks,
        type,
      });
    } catch (error) {
      console.error(error);

      setResponse({
        title: "Unable to load your tasks",

        description:
          "Please make sure the backend server is running and you are logged in.",

        tasks: [],

        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExample = (example) => {
    setMessage(example);
  };

  const getTaskIcon = (status) => {
    if (status === "Completed") {
      return <CheckCircle2 size={18} />;
    }

    if (status === "In Progress") {
      return <AlertCircle size={18} />;
    }

    return <Clock3 size={18} />;
  };

  return (
    <div className="ai-page">

      {/* HEADER */}
      <div className="ai-page-header">
        <p className="ai-label">
          <Sparkles size={16} />
          AI TASK INTELLIGENCE
        </p>

        <h1>
          AI Task <span>Assistant</span>
        </h1>

        <p>
          Ask about your tasks naturally and TaskPilot AI will help you
          manage them.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="ai-grid">

        {/* LEFT PANEL */}
        <div className="ai-panel ai-input-panel">

          <div className="ai-panel-heading">
            <div className="ai-heading-icon">
              <Bot size={25} />
            </div>

            <div>
              <h2>Ask TaskPilot AI</h2>

              <p>
                Ask about your existing tasks or create a new one.
              </p>
            </div>
          </div>

          <textarea
            className="ai-textarea"
            placeholder="Example: Show me all my remaining tasks"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askAI();
              }
            }}
          />

          <div className="ai-examples">
            <p>Try an example:</p>

            <div className="example-buttons">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleExample(example)}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <button
            className="ask-ai-button"
            onClick={askAI}
            disabled={loading}
          >
            <Send size={19} />

            {loading
              ? "Checking your tasks..."
              : "Ask TaskPilot AI"}
          </button>

        </div>

        {/* RIGHT PANEL */}
        <div className="ai-panel ai-response-panel">

          {!response && (
            <div className="ai-empty-response">

              <div className="ai-response-icon">
                <Bot size={45} />
              </div>

              <h2>Waiting for your request</h2>

              <p>
                Ask about your tasks and I'll help you manage them.
              </p>

            </div>
          )}

          {response && (
            <div className="ai-response-content">

              {/* FIXED RESPONSE HEADER */}
              <div className="ai-response-top">

                <div className="ai-response-icon small">
                  <Sparkles size={26} />
                </div>

                <div>
                  <p className="response-label">
                    AI RESPONSE
                  </p>

                  <h2>{response.title}</h2>
                </div>

              </div>

              {/* FIXED DESCRIPTION */}
              <p className="response-description">
                {response.description}
              </p>

              {/* ONLY THIS TASK LIST SCROLLS */}
              {response.tasks.length > 0 && (
                <div className="ai-response-scroll">

                  <div className="ai-task-list">

                    {response.tasks.map((task) => (
                      <div
                        className="ai-task-item"
                        key={task.id}
                      >

                        <div className="ai-task-status">
                          {getTaskIcon(task.status)}
                        </div>

                        <div className="ai-task-info">

                          <h3>{task.title}</h3>

                          {task.description && (
                            <p>{task.description}</p>
                          )}

                        </div>

                        <span
                          className={`ai-status ${
                            task.status
                              .toLowerCase()
                              .replace(/\s+/g, "-")
                          }`}
                        >
                          {task.status}
                        </span>

                      </div>
                    ))}

                  </div>

                </div>
              )}

              {response.tasks.length === 0 &&
                response.type !== "help" &&
                response.type !== "create" &&
                response.type !== "error" && (
                  <div className="no-ai-tasks">

                    <ListTodo size={28} />

                    <p>No matching tasks found.</p>

                  </div>
                )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default AIAssistant;