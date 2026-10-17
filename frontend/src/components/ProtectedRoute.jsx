import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
    const { token, user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user?.role) {
        const userRole = String(user.role).replace('ROLE_', '').toUpperCase();
        const normalizedAllowedRoles = allowedRoles.map(role =>
            String(role).replace('ROLE_', '').toUpperCase()
        );

        if (!normalizedAllowedRoles.includes(userRole)) {
            // Redirect regular users away from admin-only routes
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />;
}