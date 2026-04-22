import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { Plus, Pencil, Trash2, UserCog, X, Loader2 } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', passwordHash: '', role: 'STAFF' });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err) { console.error("Fetch failed", err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, formData);
            } else {
                await userService.createUser(formData);
            }
            setIsModalOpen(false);
            setEditingUser(null);
            setFormData({ username: '', email: '', password: '', role: 'STAFF' });
            fetchUsers();
        } catch (err) { alert("Action failed: Check console for details"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            await userService.deleteUser(id);
            fetchUsers();
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({ username: user.username, email: user.email, role: user.role, password: '' });
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></div>;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-8">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-black">User Management</h1>
                    <p className="text-slate-500">Manage access for Doctors and Staff</p>
                </div>
                <button
                    onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                    <Plus size={20} /> Add User
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-black font-bold uppercase text-xs">
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-black">
                    {users.map(u => (
                        <tr key={u.userId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><UserCog size={16}/></div>
                                <span className="font-medium">{u.username}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{u.email}</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100">{u.role}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => openEditModal(u)} className="p-2 text-slate-400 hover:text-blue-600"><Pencil size={18}/></button>
                                <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-400 hover:text-red-600 ml-2"><Trash2 size={18}/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-black">{editingUser ? 'Edit User' : 'New Staff Member'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-black"><X/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-black" required
                                       value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                <input type="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-black" required
                                       value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            {!editingUser && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                                    <input type="password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-black" required
                                           value={formData.password} onChange={e => setFormData({...formData, passwordHash: e.target.value})} />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-black"
                                        value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                    <option value="STAFF">Staff</option>
                                    <option value="DOCTOR">Doctor</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg mt-4">
                                {editingUser ? 'Update Member' : 'Create Member'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;