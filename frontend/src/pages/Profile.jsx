import React from 'react';
import {
    User, Mail, Shield, Key,
    Save, Camera, Briefcase,
    FileSignature, Upload
} from 'lucide-react';

const Profile = () => {
    const userRole = localStorage.getItem('role') || 'STAFF';

    return (
        <div className="max-w-4xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">User Profile</h1>
                <p className="text-slate-500 text-sm">Manage your user details and credentials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: Avatar & Role */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                        <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                                <User size={64} className="text-slate-300" />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform">
                                <Camera size={16} />
                            </div>
                        </div>
                        <div className="mt-6">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Jethro Orencia</h2>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 border border-blue-100">
                                <Shield size={12} /> {userRole}
                            </div>
                        </div>
                    </div>

                    {/* Professional Info Snippet */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Usage Note</h3>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                            The license number and signature provided here will be automatically appended to medical certificates, referrals, and lab requests.
                        </p>
                    </div>
                </div>

                {/* Right Column: Settings Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 border-b pb-4 flex items-center gap-2">
                            <Briefcase size={14}/> Account Details
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <ProfileInput label="Full Name" value="Jethro Emmanuelle Orencia" />
                            <ProfileInput label="Email Address" value="jethro.orencia@jhr.com" icon={<Mail size={14}/>} />
                            <ProfileInput label="License Number (PRC)" value="0123456" />
                            <ProfileInput label="Specialization" value={userRole === 'DOCTOR' ? 'General Medicine' : 'N/A'} />
                        </div>

                        {/* Signature Section */}
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-b pb-4 flex items-center gap-2">
                            <FileSignature size={14}/> Professional Signature
                        </h3>

                        <div className="mb-8">
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 flex flex-col items-center justify-center group hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                    <Upload size={20} className="text-slate-400 group-hover:text-blue-600" />
                                </div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attach Digital Signature</p>
                                <p className="text-[9px] text-slate-400 mt-1 uppercase">Transparent PNG preferred</p>
                                <button className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-tighter shadow-sm hover:bg-slate-900 hover:text-white transition-all">
                                    Browse Files
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 border-b pb-4 flex items-center gap-2">
                            <Key size={14}/> Security
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ProfileInput label="Current Password" type="password" placeholder="••••••••" />
                            <ProfileInput label="New Password" type="password" placeholder="Leave blank to keep current" />
                        </div>

                        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
                            <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer">
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileInput = ({ label, value, type = "text", placeholder = "", icon }) => (
    <div className="flex flex-col text-left">
        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-tight">{label}</label>
        <div className="relative">
            {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
            <input
                type={type}
                className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all`}
                defaultValue={value}
                placeholder={placeholder}
            />
        </div>
    </div>
);

export default Profile;