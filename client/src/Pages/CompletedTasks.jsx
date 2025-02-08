import React, { useEffect, useState } from "react";
import * as API from "../Api";
import "./CompletedTasks.css";
import NavBar from "../Components/Navbar";

const CompletedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        console.error("User ID not found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await API.getCompletedTasks(userId);
        setTasks(response.completed_tasks); 
      } catch (error) {
        console.error("Error fetching completed tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, []);

  return (
    <div className="completed-tasks-container">
      <NavBar /> {}

      <h1 className="completed-tasks-title">Completed Tasks</h1>
      {loading ? (
        <p className="loading">Loading completed tasks...</p>
      ) : tasks.length > 0 ? (
        <ul className="completed-tasks-list">
          {tasks.map((task) => (
            <li key={task._id} className="completed-task-item">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p className="task-date">
                Completed on: {new Date(task.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-tasks">You have no Completed Tasks</p>
      )}
    </div>
  );
};

export default CompletedTasks;
