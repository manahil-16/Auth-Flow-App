import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const saved = localStorage.getItem(`tasks_${user?.id}`);
    if (saved) setTasks(JSON.parse(saved));
  }, [user]);

  useEffect(() => {
    if (user?.id) localStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasks));
  }, [tasks, user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask.trim(), done: false, priority }]);
    setNewTask("");
  };

  const toggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const visibleTasks = tasks.filter(t => {
    if (filter === "active") return !t.done;
    if (filter === "completed") return t.done;
    return true;
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="dashboard-page">
      <div className="dash-header">
        <div>
          <h2>Dashboard</h2>
          <p className="dash-greeting">{greeting}, {user?.name}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-num">{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="tasks-section">
        <h3>My Tasks</h3>
        <form className="task-input-row" onSubmit={addTask}>
          <input
            placeholder="Add a task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
          />
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button className="task-add-btn" type="submit">Add</button>
        </form>

        <div className="filter-tabs">
          {["all", "active", "completed"].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {visibleTasks.length === 0 ? (
          <p className="task-empty">No tasks here — add one above</p>
        ) : (
          <ul className="task-list">
            {visibleTasks.map(task => (
              <li key={task.id} className={`task-item ${task.done ? "done" : ""}`}>
                <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
                <span className="task-text">{task.text}</span>
                <span className={`priority-tag priority-${task.priority}`}>{task.priority}</span>
                <button className="task-delete" onClick={() => deleteTask(task.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}