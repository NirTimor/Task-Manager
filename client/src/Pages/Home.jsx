import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as API from "../Api";
import NavBar from "../Components/Navbar";
import { isLoggedIn } from "../Utils/auth";
import "./Home.css";

const HomePage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("priority");
  const [fullName, setFullName] = useState("");
  const userId = localStorage.getItem("user_id");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editedTask, setEditedTask] = useState({ title: "", description: "", priority: "Medium" });

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    } else {
      fetchUserDetails(userId);
      fetchTasks();
    }
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      if (userId) {
        const userData = await API.getUserDetails(userId);
        setFullName(userData.full_name);
      } else {
        console.warn("No userId provided to fetchUserDetails");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await API.getTasks(userId);
      const normalizedTasks = data.tasks.map((task) => ({
        ...task,
        id: task._id,
      }));
      setTasks(normalizedTasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setEditedTask({ title: task.title, description: task.description, priority: task.priority });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  };

  const handleUpdateTask = async () => {
    if (!taskToEdit) return;

    try {
      await API.updateTask(taskToEdit.id, editedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskToEdit.id ? { ...task, ...editedTask } : task
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleMarkAsComplete = async (taskId) => {
    try {
      await API.updateTaskStatus(taskId, { is_completed: true });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, is_completed: true } : task
        )
      );
    } catch (error) {
      console.error("Error marking task as complete:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      try {
        await API.deleteTask(taskId);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    } else {
      console.log("Task deletion canceled.");
    }
  };


  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.is_completed;
    if (filter === "pending") return !task.is_completed;
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortOrder === "priority") {
      const priorities = { Low: 1, Medium: 2, High: 3 };
      return priorities[b.priority] - priorities[a.priority];
    }
    if (sortOrder === "date") {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return 0;
  });

  return (
    <div className="homepage">
      <NavBar user={user} onLogout={onLogout} />

      <div className="task-summary">
        <p>Total Tasks: {tasks.length}</p>
        <p>Completed: {tasks.filter((task) => task.is_completed).length}</p>
        <p>Pending: {tasks.filter((task) => !task.is_completed).length}</p>
      </div>

      <div className="task-header">
        <h1>Welcome, {fullName || "User"}!</h1>
        <p>Here are your tasks for today. Stay productive!</p>

        <div className="task-filters">
          <select onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="pending">Incompleted</option>
          </select>
          <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
            <option value="priority">Sort by Priority</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>
      </div>

      <div className="task-list-container">
        {sortedTasks.length > 0 ? (
          <div className="task-list">
            {sortedTasks.map((task) => (
              <div key={task.id} className="card">
                <h5>{task.title}</h5>
                <p>{task.description}</p>
                <p>
                  Priority:{" "}
                  <span className={`priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </p>
                <p>Status: {task.is_completed ? "Completed" : "Incompleted"}</p>
                <button className="edit-task-btn" onClick={() => openEditModal(task)}>
                  Edit Task
                </button>
                {!task.is_completed && (
                  <button
                    className="mark-complete-btn"
                    onClick={() => handleMarkAsComplete(task.id)}
                  >
                    Mark as Complete
                  </button>
                )}
                <button
                  className="delete-task-btn"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete Task
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-tasks-message">No tasks available. Add a new task to get started!</p>
        )}
      </div>

      <button className="fab" onClick={() => navigate("/add-task")}>+</button>

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <label>Title:</label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            />
            <label>Description:</label>
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            />
            <label>Priority:</label>
            <select
              value={editedTask.priority}
              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <div className="modal-buttons">
              <button onClick={handleUpdateTask}>Save Changes</button>
              <button onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
