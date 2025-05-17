import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Score report API endpoints
export const scoreReportAPI = {
  uploadReport: (formData: FormData) => {
    return api.post('/reports/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getReportById: (reportId: string) => {
    return api.get(`/reports/${reportId}`);
  },
  getUserReports: (userId: string) => {
    return api.get(`/reports/user/${userId}`);
  },
};

// Auth API endpoints
export const authAPI = {
  login: (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    return api.post('/auth/register', userData);
  },
  forgotPassword: (email: string) => {
    return api.post('/auth/forgot-password', { email });
  },
  resetPassword: (token: string, newPassword: string) => {
    return api.post('/auth/reset-password', { token, newPassword });
  },
};

// User API endpoints
export const userAPI = {
  getCurrentUser: () => {
    return api.get('/users/me');
  },
  updateProfile: (userData: { firstName?: string; lastName?: string; email?: string }) => {
    return api.put('/users/me', userData);
  },
};

// Skills API endpoints
export const skillsAPI = {
  getUserSkills: () => {
    return api.get('/skills/user');
  },
  getSkillDetails: (skillId: string) => {
    return api.get(`/skills/${skillId}`);
  },
};

// Video lessons API endpoints
export const videosAPI = {
  getRecommendedVideos: () => {
    return api.get('/videos/recommended');
  },
  getVideoById: (videoId: string) => {
    return api.get(`/videos/${videoId}`);
  },
  markVideoComplete: (videoId: string) => {
    return api.post(`/videos/${videoId}/complete`);
  },
};

// Practice questions API endpoints
export const questionsAPI = {
  getQuestionsBySkill: (skillId: string) => {
    return api.get(`/questions/skill/${skillId}`);
  },
  submitAnswer: (questionId: string, answer: string) => {
    return api.post(`/questions/${questionId}/answer`, { answer });
  },
};

export default api; 