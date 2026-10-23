import { useEffect, useState } from "react";
import { Info, LoaderCircle, Sparkles } from "lucide-react";
import {
  createTask,
  deleteTask,
  generateTaskDescription,
  getTasks,
  isAuthenticated,
  login,
  logout,
  register,
  updateTask,
} from "../api.js";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [authenticated, setAuthenticated] = useState(isAuthenticated);
  const [authMode, setAuthMode] = useState("login");
  const [loading, setLoading] = useState(isAuthenticated);
  const [saving, setSaving] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generating, setGenerating] = useState(false);
  const [aiNote, setAiNote] = useState("");

  useEffect(() => {
    if (!authenticated) return undefined;
    let cancelled = false;
    setLoading(true);
    setError("");

    getTasks()
      .then((data) => {
        if (!cancelled) setTasks(Array.isArray(data) ? data : []);
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(requestError.message || "Failed to load tasks.");
          if (requestError.status === 401) {
            setAuthenticated(false);
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (authMode === "register") {
        await register(credentials);
      }
      await login(credentials);
      setAuthenticated(true);
      setCredentials({ email: "", password: "" });
      setSuccess(
        authMode === "register"
          ? "Account registered and logged in successfully!"
          : "Logged in successfully!"
      );
    } catch (requestError) {
      setError(requestError.message || "Authentication failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setTasks([]);
    setSuccess("Logged out successfully.");
    setError("");
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const task = await createTask(form);
      setTasks((currentTasks) => [task, ...currentTasks]);
      setForm({ title: "", description: "" });
      setSuccess("Task created successfully.");
    } catch (requestError) {
      setError(requestError.message || "Unable to create task.");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateDescription = async () => {
    const title = form.title.trim();
    if (!title || generating) return;
    setGenerating(true);
    setAiNote("");
    setError("");
    try {
      const result = await generateTaskDescription(title);
      const description = String(result.description || "").trim().slice(0, 300);
      if (!description) throw new Error("Empty description returned.");
      setForm((currentForm) => ({ ...currentForm, description }));
    } catch {
      // Graceful local suggestion fallback as required by specification
      const localSuggestion = `Break down "${title.slice(0, 90)}" into clear steps, complete the work, and verify the result before marking it done.`.slice(0, 300);
      setForm((currentForm) => ({ ...currentForm, description: localSuggestion }));
      setAiNote("AI service is unconfigured or unreachable. A local suggestion was added that you can review and edit before saving.");
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleTask = async (task) => {
    setBusyTaskId(task._id);
    setError("");
    try {
      const updated = await updateTask(task._id, { completed: !task.completed });
      setTasks((currentTasks) =>
        currentTasks.map((t) => (t._id === updated._id ? updated : t))
      );
    } catch (requestError) {
      setError(requestError.message || "Unable to update task.");
    } finally {
      setBusyTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setBusyTaskId(taskId);
    setError("");
    try {
      await deleteTask(taskId);
      setTasks((currentTasks) => currentTasks.filter((t) => t._id !== taskId));
      setSuccess("Task deleted successfully.");
    } catch (requestError) {
      setError(requestError.message || "Unable to delete task.");
    } finally {
      setBusyTaskId(null);
    }
  };

  return (
    <section className="section task-manager-page">
      <div className="task-manager-page__inner">
        <h1 className="task-manager-page__heading">Task Manager</h1>

        <div className="task-manager">
          <div className="task-manager__intro">
            <h3>Manage your work.</h3>
            <p>
              {authenticated
                ? "Create, complete, and remove tasks stored in MongoDB."
                : "Sign in or create an account to access protected tasks."}
            </p>
          </div>

          {authenticated ? (
            <form className="task-form" onSubmit={handleTaskSubmit}>
              <label htmlFor="task-title">Title</label>
              <input
                id="task-title"
                required
                maxLength={120}
                placeholder="What needs to be done?"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />

              <div className="description-row">
                <label htmlFor="task-description">Description</label>
                <div className="description-box">
                  <textarea
                    id="task-description"
                    maxLength={300}
                    placeholder="Add details for your task..."
                    rows={3}
                    value={form.description}
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                  />
                  <div className="description-meta">
                    <span className="description-count" aria-live="polite">
                      {form.description.length} / 300
                    </span>
                    <button
                      className="ai-button"
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={!form.title.trim() || generating}
                      aria-busy={generating}
                      aria-label={generating ? "Generating task description" : "Generate task description"}
                      title="Generate with AI"
                    >
                      {generating ? (
                        <LoaderCircle className="ai-button__spinner" aria-hidden="true" />
                      ) : (
                        <Sparkles aria-hidden="true" />
                      )}
                      {generating ? "Generating…" : "Generate with AI"}
                    </button>
                  </div>
                  {aiNote && (
                    <p className="task-form__helper" role="status" aria-live="polite">
                      <Info aria-hidden="true" /> {aiNote}
                    </p>
                  )}
                </div>
              </div>

              <div className="task-form-actions">
                <button className="primary-button" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Add Task"}
                </button>
                <button className="auth-switch" type="button" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </form>
          ) : (
            <form className="task-form" onSubmit={handleAuthSubmit}>
              <label htmlFor="auth-email">Email Address</label>
              <input
                id="auth-email"
                type="email"
                required
                placeholder="student@charusat.edu.in"
                value={credentials.email}
                onChange={(event) =>
                  setCredentials({ ...credentials, email: event.target.value })
                }
              />

              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials({ ...credentials, password: event.target.value })
                }
              />

              <div className="task-form-actions">
                <button className="primary-button" type="submit" disabled={saving}>
                  {saving
                    ? "Processing..."
                    : authMode === "login"
                    ? "Sign In"
                    : "Create Account"}
                </button>
                <button
                  className="auth-switch"
                  type="button"
                  onClick={() => {
                    setAuthMode((prev) => (prev === "login" ? "register" : "login"));
                    setError("");
                    setSuccess("");
                  }}
                >
                  {authMode === "login"
                    ? "Need an account? Register"
                    : "Already registered? Sign In"}
                </button>
              </div>
            </form>
          )}

          <div className="task-list" aria-live="polite">
            {error && <p className="task-error" role="alert">{error}</p>}
            {success && <p className="task-success" role="status">{success}</p>}

            {loading && <p className="task-empty">Loading tasks from server...</p>}

            {!loading && authenticated && tasks.length === 0 && (
              <p className="task-empty">No tasks yet. Create your first task above!</p>
            )}

            {!loading && authenticated && tasks.map((task) => (
              <article
                className={`task-card${task.completed ? " task-card--done" : ""}`}
                key={task._id}
              >
                <div className="task-card__top">
                  <div>
                    <h4>{task.title}</h4>
                    {task.description && <p>{task.description}</p>}
                  </div>
                  <span
                    className={`task-status ${
                      task.completed ? "task-status--done" : "task-status--pending"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>
                <div className="task-card__actions">
                  <button
                    className="task-action"
                    type="button"
                    disabled={busyTaskId === task._id}
                    onClick={() => handleToggleTask(task)}
                  >
                    {task.completed ? "Mark Incomplete" : "Complete"}
                  </button>
                  <button
                    className="task-action task-action--delete"
                    type="button"
                    disabled={busyTaskId === task._id}
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
