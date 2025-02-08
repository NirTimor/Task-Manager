import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Homepage from './Pages/Home';
import Register from './Pages/Register';
import AddTaskPage from './Pages/AddTaskPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import CompletedTasks from './Pages/CompletedTasks';

const App = () => {
  const [isAuth, setAuth] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/add-task" element={<AddTaskPage />} />
        <Route path="/completedtasks" element={<CompletedTasks />} />
      </Routes>
    </Router>
  );
};

export default App;
