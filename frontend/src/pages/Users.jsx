import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService'; // Import the service
import { Plus, Pencil, Trash2, UserCog, Loader2 } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError("Failed to load users. Are you logged in as an ADMIN?");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 text-blue-600">
            <Loader2 className="animate-spin mb-2" size={40} />
            <p className="text-black font-medium">Fetching medical staff...</p>
        </div>
    );

    return (
        <div className="w-full">
            {/* Header section remains the same */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-black">User Management</h1>
                    <p className="text-slate-500">Manage clinic staff access and permissions</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                    <Plus size={20} />
                    <span>Add New User</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {/* Table mapping logic */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-sm font-bold text-black uppercase">User</th>
                        <th className="px-6 py-4 text-sm font-bold text-black uppercase">Email</th>
                        <th className="px-6 py-4 text-sm font-bold text-black uppercase">Role</th>
                        <th className="px-6 py-4 text-sm font-bold text-black uppercase text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-black">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <UserCog size={16} />
                                </div>
                                {user.username}
                            </td>
                            <td className="px-6 py-4 text-slate-600">{user.email}</td>
                            <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100">
                                        {user.role}
                                    </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-blue-600 p-1"><Pencil size={18}/></button>
                                <button className="text-slate-400 hover:text-red-600 p-1 ml-2"><Trash2 size={18}/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;