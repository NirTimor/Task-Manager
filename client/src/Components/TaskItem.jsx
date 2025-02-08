import React from 'react';

const TaskItem = ({ task, onDelete }) => {
  return (
    <li>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Deadline: {task.deadline}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.is_completed ? 'Completed' : 'Pending'}</p>
      <button onClick={() => onDelete(task.id)}>Delete</button>
      {/* You can add more buttons here for editing or marking as completed */}
    </li>
  );
};

export default TaskItem;
