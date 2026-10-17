import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Pre-configured Axios instance with JWT interceptor

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'STAFF' });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingId) {
                await api.put(`/admin/users/${editingId}`, {
                    email: formData.email,
                    role: formData.role,
                    ...(formData.password && { password: formData.password })
                });
            } else {
                await api.post('/admin/users', formData);
            }
            setFormData({ username: '', email: '', password: '', role: 'STAFF' });
            setEditingId(null);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (user) => {
        setEditingId(user.userId);
        setFormData({ username: user.username, email: user.email, password: '', role: user.role });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                    type="text"
                    placeholder="Username"
                    disabled={!!editingId}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="border p-2 rounded disabled:bg-gray-100"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder={editingId ? 'New Password (Optional)' : 'Password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border p-2 rounded"
                    required={!editingId}
                />
                <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="border p-2 rounded"
                >
                    <option value="ADMIN">ADMIN</option>
                    <option value="DOCTOR">DOCTOR</option>
                    <option value="STAFF">STAFF</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition">
                    {editingId ? 'Update User' : 'Add User'}
                </button>
            </form>

            {/* User Table */}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="p-3 font-semibold text-gray-600">ID</th>
                        <th className="p-3 font-semibold text-gray-600">Username</th>
                        <th className="p-3 font-semibold text-gray-600">Email</th>
                        <th className="p-3 font-semibold text-gray-600">Role</th>
                        <th className="p-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.userId} className="border-b hover:bg-gray-50">
                            <td className="p-3">{user.userId}</td>
                            <td className="p-3 font-medium">{user.username}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'DOCTOR' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                            </td>
                            <td className="p-3 space-x-2">
                                <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline">Edit</button>
                                <button onClick={() => handleDelete(user.userId)} className="text-red-600 hover:underline">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}