import axios from 'axios';
const userId = localStorage.getItem("user_id");

const API_BASE_URL = 'http://127.0.0.1:8000/';
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const addTask = async (taskData) => {
  try {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      throw new Error("User is not logged in");
    }

    const requestBody = {
      ...taskData,
      user_id: userId,
    };

    const response = await api.post("/tasks/", requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding task:", error.response?.data || error.message);
    throw error;
  }
};



export const getTasks = async (userId) => {
  try {
    const { data } = await api.get(`/tasks/`, {
      params: { user_id: userId },
    });
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};


export const getTaskById = async (id) => {
  try {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
};

export const updateTask = async (taskId, updatedData) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, updatedData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};


export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};


export const registerUser = async (user) => {
  try {
    const { data } = await api.post('/auth/signup', user);
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const { data } = await api.post('/login/', credentials);
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const markTaskAsComplete = async (taskId) => {
  try {
    const response = await api.patch(
      '/tasks/complete',
      null,
      {
        params: { task_id: taskId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking task as complete:", error);
    throw error;
  }
};

export const getCompletedTasks = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is not available in localStorage");

    const response = await api.get("/tasks/completed/", {
      params: { user_id: userId },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching completed tasks:", error.response?.data || error.message);
    throw error;
  }
};

export const getUserDetails = async (userId) => {
  try {
    const response = await api.get("/user/details_by_id", {
      params: { user_id: userId },
    });

    return response.data;
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId, updates) => {
  try {
    const response = await api.patch(`/tasks/complete?task_id=${taskId}`, updates, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};


export default api;
