import api from './api';

// src/services/userService.js
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    console.log("Token being sent:", token); // Debug line
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};
export const userService = {

    // Login call
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // Get all users (Admin only)
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },


    // Create new user
    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    }
};