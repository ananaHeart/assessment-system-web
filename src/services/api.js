import axios from 'axios';

const API_BASE = 'http://localhost:8080';  // Your backend URL
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,  // If using cookies/sessions
});

// Interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');  // Or from context/state
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const enrollmentService = {
  parseFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/process-enrollment-file/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  saveAssignments: (data) => api.post('/process-enrollment-file/save', data),
};

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleUpload = async () => {
  const formData = new FormData();
  formData.append('file', selectedFile);

  try {
    const response = await api.post('/process-enrollment-file/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log("Success:", response.data);
  } catch (err) {
    console.error("Error:", err.response?.data);
    alert("Upload failed: " + (err.response?.data || "Unauthorized"));
  }
};

export default api;