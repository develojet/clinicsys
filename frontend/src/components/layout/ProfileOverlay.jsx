import React from 'react';
import { X, Shield, Mail, Key, Settings } from 'lucide-react';

const ProfileOverlay = ({ onClose, userRole }) => {
    return (
        <div className="absolute top-24 right-8 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in duration-200 z-50 text-left">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">User Settings</h4>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X size={18} />
                </button>
            </div>

            <div className="space-y-4">
                {/* Role Badge */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <Shield size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase">Current Role</p>
                        <p className="text-sm font-bold text-slate-800">{userRole}</p>
                    </div>
                </div>

                {/* Quick Edit Fields */}
                <div className="space-y-3">
                    <div className="flex flex-col">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                            <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all" defaultValue="jethro.orencia@jhr.com" />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1 mb-1">Change Password</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                            <input type="password" placeholder="••••••••" className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none" />
                        </div>
                    </div>
                </div>

                <button className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2">
                    <Settings size={14} /> Update Profile
                </button>
            </div>
        </div>
    );
};

export default ProfileOverlay;