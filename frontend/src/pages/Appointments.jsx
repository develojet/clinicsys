import React, { useState, useMemo } from 'react';
import {
    Calendar, Plus, Search, Clock,
    ChevronRight, X, User
} from 'lucide-react';

// Subpage Imports
import FollowupConsultDetails from './subpages/FollowupConsultDetails';
import OptaConsultDetails from './subpages/OptaConsultDetails';
// Import your new components here as you create them:
import EntConsultDetails from './subpages/EntConsultDetails';
import MedicineConsultDetails from './subpages/MedicineConsultDetails';
import OBConsultDetails from './subpages/OBConsultDetails';
import PediaConsultDetails from './subpages/PediaConsultDetails';
import ReferralConsultDetails from './subpages/ReferralConsultDetails';

const Appointments = () => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [appointments, setAppointments] = useState([
        { id: 1024, patient: "Maria Clara", type: "Follow-up", time: "09:00 AM", date: "2026-05-01", complaint: "Persistent redness" },
        { id: 1025, patient: "Juan Dela Cruz", type: "Opta", time: "10:30 AM", date: "2026-05-01", complaint: "Blurry vision" },
        { id: 1026, patient: "Crisostomo Ibarra", type: "ENT", time: "11:00 AM", date: "2026-05-01", complaint: "Ear pain" },
        { id: 1027, patient: "Leonor Rivera", type: "OB", time: "01:30 PM", date: "2026-05-01", complaint: "Prenatal checkup" },
        { id: 1028, patient: "Padre Damaso", type: "Medicine", time: "02:00 PM", date: "2026-05-01", complaint: "General checkup" },
        { id: 1029, patient: "Basilio Santos", type: "Pedia", time: "03:30 PM", date: "2026-05-01", complaint: "Vaccination" },
        { id: 1030, patient: "Sisa Gonzales", type: "Referral", time: "04:00 PM", date: "2026-05-01", complaint: "Specialist referral" },
    ]);

    const consultationTypes = ["ENT", "Follow-up", "Opta", "Medicine", "OB", "Pedia", "Referral"];

    const handleAddAppointment = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newAppt = {
            id: Math.floor(Math.random() * 10000),
            patient: formData.get('patient'),
            type: formData.get('type'),
            time: formData.get('time'),
            date: formData.get('date'),
            complaint: "New consultation request"
        };
        setAppointments([newAppt, ...appointments]);
        setIsBookingModalOpen(false);
    };

    const filteredAppointments = useMemo(() => {
        return appointments.filter(appt =>
            appt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appt.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, appointments]);

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 text-left">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic flex items-center gap-3">
                        <Calendar className="text-emerald-600" size={32} />
                        Appointments
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage patient bookings and clinical entries.</p>
                </div>
                <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    <Plus size={18} /> New Appointment
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search patients or consultation type..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-slate-700"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                    <tbody className="divide-y divide-slate-50">
                    {filteredAppointments.map((appt) => (
                        <tr
                            key={appt.id}
                            onClick={() => { setSelectedAppointment(appt); setIsConsultModalOpen(true); }}
                            className="hover:bg-emerald-50/30 transition-colors cursor-pointer group"
                        >
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{appt.patient}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: #{appt.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-6 text-center">
                                <span className="px-4 py-1.5 bg-slate-100 text-[10px] font-black uppercase rounded-xl text-slate-500 border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                                    {appt.type}
                                </span>
                            </td>
                            <td className="px-6 py-6 text-right">
                                <div className="flex items-center justify-end gap-4">
                                    <div className="text-right">
                                        <p className="text-xs font-black text-slate-700">{appt.time}</p>
                                        <p className="text-[10px] text-slate-400">{appt.date}</p>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Consultation Overlay */}
            {/* --- MODAL 2: CLINICAL CONSULTATION OVERLAY --- */}
            {isConsultModalOpen && selectedAppointment && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl max-h-[95vh] overflow-y-auto custom-scrollbar rounded-[2.5rem] pt-12 pb-4 px-4">
                        <div className="relative">
                            {/* Repositioned Close Button to the far right edge */}
                            <button
                                onClick={() => setIsConsultModalOpen(false)}
                                className="absolute -top-6 -right-2 md:-right-4 bg-white p-3 rounded-full shadow-2xl z-[140] hover:bg-slate-50 transition-all cursor-pointer border border-slate-100 flex items-center justify-center active:scale-90"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>

                            {/* Render Component based on Type */}
                            {(() => {
                                const props = {
                                    visitData: selectedAppointment,
                                    onSave: () => setIsConsultModalOpen(false)
                                };

                                switch (selectedAppointment.type) {
                                    case 'Opta': return <OptaConsultDetails {...props} />;
                                    case 'Follow-up': return <FollowupConsultDetails {...props} />;
                                    case 'ENT': return <EntConsultDetails {...props} />;
                                    case 'Medicine': return <MedicineConsultDetails {...props} />;
                                    case 'OB': return <OBConsultDetails {...props} />;
                                    case 'Pedia': return <PediaConsultDetails {...props} />;
                                    case 'Referral': return <ReferralConsultDetails {...props} />;
                                    default:
                                        return (
                                            <div className="bg-white p-20 rounded-[2.5rem] text-center border border-slate-100 shadow-xl">
                                                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                                                    Clinical Form for {selectedAppointment.type} coming soon
                                                </p>
                                            </div>
                                        );
                                }
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Modal logic remains same as previous version... */}
        </div>
    );
};

export default Appointments;