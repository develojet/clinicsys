import api from './api';

export const userService = {
    // Login call
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // Get all users (Admin only)
    getUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    // Create new user
    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    }
};