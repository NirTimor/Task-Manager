import React, { useState } from "react";
import "./AddTaskForm.css";

const AddTaskForm = ({ onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newTask = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
    };
    try {
      await onTaskAdded(newTask); 
      setFormData({ title: "", description: "", priority: "Medium" });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  

  return (
    <div className="add-task">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          required
        />
        <select
          name="priority" 
          value={formData.priority}
          onChange={handleChange}
          required
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default AddTaskForm;
