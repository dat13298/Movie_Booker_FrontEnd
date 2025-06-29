// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/auth/AuthProvider.jsx";

export default function ProtectedRoute({ requiredRole }) {
    const { auth, userInfo } = useContext(AuthContext);

    // Nếu chưa đăng nhập
    if (!auth?.accessToken || !userInfo) {
        return <Navigate to="/admin/login" replace />;
    }

    // Nếu có yêu cầu quyền nhưng không đủ quyền
    if (requiredRole && userInfo.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
