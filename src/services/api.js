import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('jwtToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const api = {
    auth: {
        login: (credentials) => apiClient.post('/auth/login', credentials),
        verifyEmail: (email) => apiClient.post('/auth/verify', { email }),
        activateAccount: (data) => apiClient.post('/auth/activate', data),
    },
    import: {
        analyze: (formData) => apiClient.post('/import/analyze', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        process: (formData) => apiClient.post('/import/process', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
    },
};

export default apiClient;