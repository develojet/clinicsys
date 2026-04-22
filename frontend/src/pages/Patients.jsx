import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, UserPlus, Filter,
    Calendar, ChevronRight, ArrowRightLeft
} from 'lucide-react';

const Patients = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    // Sample Data including new Referral entry
    const [patients] = useState([
        { id: 1021, fullName: "Maria Clara", dob: "1992-05-12", lastVisit: "2026-04-05", status: "Pregnant", primaryDept: "OB" },
        { id: 1022, fullName: "Gabriela Silang", dob: "1988-10-20", lastVisit: "2024-01-10", status: "Follow-up", primaryDept: "OB" },
        { id: 1023, fullName: "Leonor Rivera", dob: "1867-04-11", lastVisit: "2026-04-01", status: "Hypertension", primaryDept: "Medicine" },
        { id: 1024, fullName: "Juan Luna", dob: "1857-10-23", lastVisit: "2026-02-17", status: "Chronic Sinusitis", primaryDept: "ENT" },
        { id: 1025, fullName: "Jose Rizal", dob: "1861-06-19", lastVisit: "2026-03-20", status: "Routine Check", primaryDept: "Opta" },
        { id: 1026, fullName: "Emilio Aguinaldo", dob: "1869-03-22", lastVisit: "2026-03-15", status: "Fever", primaryDept: "Pedia" },
        { id: 1027, fullName: "Andres Bonifacio", dob: "1863-11-30", lastVisit: "2026-04-12", status: "Inter-dept Referral", primaryDept: "Referral" },
    ]);

    // Filtering logic for search
    const filteredPatients = patients.filter(p =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm)
    );

    // Dynamic Theme Mapping for consistency across the app
    const getDeptTheme = (dept) => {
        switch (dept) {
            case 'OB': return 'text-pink-600 bg-pink-50 border-pink-100';
            case 'ENT': return 'text-purple-600 bg-purple-50 border-purple-100';
            case 'Opta': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'Pedia': return 'text-cyan-600 bg-cyan-50 border-cyan-100';
            case 'Referral': return 'text-amber-600 bg-amber-50 border-amber-100';
            default: return 'text-blue-600 bg-blue-50 border-blue-100';
        }
    };

    return (
        <div className="w-full animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">

            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div className="text-left">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Patient Directory</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage hospital-wide clinical records</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-80 text-left">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all text-slate-800"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Primary Action */}
                    <button className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-slate-200 uppercase tracking-widest">
                        <UserPlus size={16} /> New Patient
                    </button>
                </div>
            </div>

            {/* --- LIST CONTAINER --- */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient ID</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Condition</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dept</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Visit</th>
                        <th className="px-8 py-5 text-right"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {filteredPatients.map((patient) => (
                        <tr
                            key={patient.id}
                            onClick={() => navigate('/patients/chart')}
                            className="group hover:bg-blue-50/30 cursor-pointer transition-colors"
                        >
                            <td className="px-8 py-4">
                                <span className="text-xs font-mono font-bold text-slate-400">#PX-{patient.id}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3 text-left">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black ${getDeptTheme(patient.primaryDept)}`}>
                                        {patient.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{patient.fullName}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{patient.dob}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                    <span className="text-xs text-slate-600 font-medium tracking-tight">
                                        {patient.status}
                                    </span>
                            </td>
                            <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter border ${getDeptTheme(patient.primaryDept)}`}>
                                        {patient.primaryDept}
                                    </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar size={12} className="opacity-40" />
                                    <span className="text-xs font-bold">{patient.lastVisit}</span>
                                </div>
                            </td>
                            <td className="px-8 py-4 text-right">
                                <div className="flex justify-end items-center gap-2">
                                        <span className="text-[10px] font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest translate-x-2 group-hover:translate-x-0">
                                            Open Chart
                                        </span>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Empty State */}
                {filteredPatients.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">No patient records found</p>
                        <p className="text-slate-400 text-xs mt-1">Try searching with a different name or ID</p>
                    </div>
                )}
            </div>

            {/* --- FOOTER / PAGINATION --- */}
            <div className="mt-6 flex justify-between items-center px-4">
                <div className="flex items-center gap-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Displaying {filteredPatients.length} of {patients.length} Records
                    </p>
                </div>
                <div className="flex gap-1">
                    <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-900 text-white shadow-md shadow-slate-200">1</button>
                    <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-500 hover:bg-slate-50">2</button>
                    <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-500 hover:bg-slate-50">3</button>
                </div>
            </div>
        </div>
    );
};

export default Patients;