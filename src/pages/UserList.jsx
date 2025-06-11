import React, { useEffect, useState } from "react";
import api from "../api/axios"; // dùng instance axios có interceptor

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/users")
            .then((res) => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("❌ Failed to fetch users:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>📋 Danh sách người dùng</h2>
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Email / Username</th>
                    <th>Roles</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.email || user.username}</td>
                        <td>{Array.isArray(user.roles) ? user.roles.join(", ") : user.roles}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
