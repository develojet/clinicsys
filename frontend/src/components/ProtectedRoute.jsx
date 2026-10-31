import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
    const { token, user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles) {
        const rawRole = user?.role || user?.accessLevel;
        const userRole = String(rawRole || '').replace(/^ROLE_/i, '').toUpperCase();
        const normalizedAllowedRoles = allowedRoles.map(role =>
            String(role).replace(/^ROLE_/i, '').toUpperCase()
        );

        if (!normalizedAllowedRoles.includes(userRole)) {
            // Redirect regular users away from admin-only routes
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <Outlet />;
}