import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserRound,
    Calendar,
    LogOut,
    User
} from 'lucide-react';

// Use the exact path to your uploaded logo asset
import JHRLogo from '../../assets/jhr-logo.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = localStorage.getItem('role') || 'STAFF';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // Helper to check if a link is active to highlight it
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-slate-900 text-white border-b border-slate-800 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Left Side: Brand Logo & Navigation Links */}
                    <div className="flex items-center gap-10">
                        <Link to="/dashboard" className="flex items-center group cursor-pointer">
                            <img
                                src={JHRLogo}
                                alt="JHR Medical"
                                className="h-10 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                            />
                        </Link>

                        <div className="flex items-center gap-1.5">
                            <NavLink to="/dashboard" label="Dashboard" active={isActive('/dashboard')} />

                            {userRole === 'ADMIN' && (
                                <NavLink to="/users" label="Users" active={isActive('/users')} />
                            )}

                            <NavLink to="/patients" label="Patients" active={isActive('/patients')} />
                            <NavLink to="/appointments" label="Appointments" active={isActive('/appointments')} />
                        </div>
                    </div>

                    {/* Right Side: Profile & Logout */}
                    <div className="flex items-center gap-4">

                        {/* Profile Button - Navigates to /profile without refresh */}
                        <div
                            onClick={() => navigate('/profile')}
                            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all border cursor-pointer group text-right ${
                                isActive('/profile')
                                    ? 'bg-blue-600/10 border-blue-500/50'
                                    : 'hover:bg-slate-800 border-transparent hover:border-slate-700'
                            }`}
                        >
                            <div className="hidden sm:block pointer-events-none">
                                <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.15em] mb-1">Access Level</p>
                                <p className={`text-xs font-bold uppercase ${isActive('/profile') ? 'text-white' : 'text-blue-300'}`}>
                                    {userRole}
                                </p>
                            </div>

                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                                isActive('/profile')
                                    ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                                    : 'bg-slate-800 border-slate-700 group-hover:bg-blue-600 group-hover:border-blue-500'
                            }`}>
                                <User size={20} className={isActive('/profile') ? 'text-white' : 'text-slate-300 group-hover:text-white'} />
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Internal NavLink Component
const NavLink = ({ to, label, active }) => (
    <Link
        to={to}
        className={`px-4 py-2 rounded-xl transition-all text-[11px] font-black uppercase tracking-tight cursor-pointer ${
            active
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
        }`}
    >
        {label}
    </Link>
);

export default Navbar;