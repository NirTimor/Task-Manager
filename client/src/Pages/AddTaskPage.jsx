import React from "react";
import AddTaskForm from "../Components/AddTaskForm";
import { addTask } from "../Api";
import NavBar from "../Components/Navbar";
import "./AddTaskPage.css";

const AddTaskPage = () => {

  const handleTaskAdded = async (newTask) => {
    try {
      const response = await addTask(newTask);
      console.log("Task added response:", response);
      alert("Task added successfully!");
    } catch (error) {
      console.error("Error adding task:", error.response?.data || error.message);
      alert("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="add-task-page">
      <NavBar /> { }
      <h1>Add a New Task</h1>
      <AddTaskForm onTaskAdded={handleTaskAdded} />
    </div>
  );
};

export default AddTaskPage;
