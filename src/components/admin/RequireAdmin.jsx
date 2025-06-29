// src/components/RequireAdmin.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function RequireAdmin() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;
        if (role !== 'ROLE_ADMIN') {
            return <Navigate to="/" replace />;
        }
        return <Outlet />;
    } catch (err) {
        console.error('Invalid token:', err);
        return <Navigate to="/admin/login" replace />;
    }
}
