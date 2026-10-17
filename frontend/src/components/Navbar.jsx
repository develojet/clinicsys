// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
//
// export default function Navbar() {
//     const { user, logout } = useAuth();
//     const location = useLocation();
//
//     // Fallback defaults if user state isn't populated yet
//     const username = user?.username || 'User';
//     const role = user?.role || 'STAFF';
//
//     const getRoleBadgeStyle = (userRole) => {
//         switch (userRole) {
//             case 'ADMIN':
//                 return 'bg-purple-100 text-purple-800 border-purple-200';
//             case 'DOCTOR':
//                 return 'bg-green-100 text-green-800 border-green-200';
//             case 'STAFF':
//                 return 'bg-blue-100 text-blue-800 border-blue-200';
//             default:
//                 return 'bg-gray-100 text-gray-800 border-gray-200';
//         }
//     };
//
//     const isActive = (path) => location.pathname === path;
//
//     return (
//         <nav className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
//             <div className="max-w-7xl mx-auto flex items-center justify-between">
//                 {/* Brand & Links */}
//                 <div className="flex items-center space-x-8">
//                     <Link to="/dashboard" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
//                         Clinic Management
//                     </Link>
//                     <div className="flex space-x-2">
//                         <Link
//                             to="/dashboard"
//                             className={`px-3 py-2 rounded-md text-sm font-medium transition ${
//                                 isActive('/dashboard')
//                                     ? 'bg-blue-50 text-blue-700'
//                                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                             }`}
//                         >
//                             Dashboard
//                         </Link>
//                         <Link
//                             to="/appointments"
//                             className={`px-3 py-2 rounded-md text-sm font-medium transition ${
//                                 isActive('/appointments')
//                                     ? 'bg-blue-50 text-blue-700'
//                                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                             }`}
//                         >
//                             Appointments
//                         </Link>
//                         {role === 'ADMIN' && (
//                             <Link
//                                 to="/users"
//                                 className={`px-3 py-2 rounded-md text-sm font-medium transition ${
//                                     isActive('/users')
//                                         ? 'bg-blue-50 text-blue-700'
//                                         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                                 }`}
//                             >
//                                 User Management
//                             </Link>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* User Badge & Logout */}
//                 <div className="flex items-center space-x-4">
//                     <div className="flex items-center space-x-2">
//                         <span className="text-sm font-semibold text-gray-700">{username}</span>
//                         <span
//                             className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${getRoleBadgeStyle(
//                                 role
//                             )}`}
//                         >
//               {role}
//             </span>
//                     </div>
//                     <button
//                         onClick={logout}
//                         className="text-sm bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1.5 rounded border border-red-200 transition"
//                     >
//                         Logout
//                     </button>
//                 </div>
//             </div>
//         </nav>
//     );
// }