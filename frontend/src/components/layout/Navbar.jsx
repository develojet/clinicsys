import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserRound, Calendar, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <nav className="bg-slate-900 text-white border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Brand & Links */}
                    <div className="flex items-center gap-12">
                        <div className="text-2xl font-bold tracking-tight text-blue-400">
                            Clinic<span className="text-white">Sys</span>
                        </div>

                        {/* Updated this div: removed 'hidden' to ensure it shows */}
                        <div className="flex items-center gap-2">
                            <NavLink to="/dashboard" icon={<LayoutDashboard size={18}/>} label="Dashboard" />

                            {/* Only Admins see User Management */}
                            {userRole === 'ADMIN' && (
                                <NavLink to="/users" icon={<Users size={18}/>} label="Users" />
                            )}

                            <NavLink to="/patients" icon={<UserRound size={18}/>} label="Patients" />
                            <NavLink to="/appointments" icon={<Calendar size={18}/>} label="Schedule" />
                        </div>
                    </div>

                    {/* Right Side: User Info & Action */}
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Access Level</p>
                            <p className="text-sm text-blue-300 font-medium">{userRole}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2.5 rounded-xl transition-all duration-200"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label }) => (
    <Link to={to} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-sm font-medium">
        {icon}
        <span className="hidden md:inline">{label}</span>
    </Link>
);

export default Navbar;