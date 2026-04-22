import React from 'react';
import { Paperclip, UserCheck, Stethoscope, Briefcase, Hash } from 'lucide-react';

const AttachmentModule = ({ onFinalize }) => {
    // These would typically come from a context or a prop in a real scenario
    const doctorName = "Jethro Emmanuelle Orencia, MD";
    const specialization = "General Medicine";
    const licenseNo = "0123456";

    return (
        <div className="space-y-8 animate-in fade-in text-left">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-blue-300 transition-colors group cursor-pointer">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50">
                    <Paperclip className="text-slate-400 group-hover:text-blue-600" size={24} />
                </div>
                <h4 className="text-sm font-bold text-slate-700">Upload Lab Results / Imaging</h4>
                <p className="text-xs text-slate-400 mt-1">Drag and drop or click to browse (PDF, JPG, PNG)</p>
            </div>

            {/* --- NEW: ATTENDING PHYSICIAN DETAILS --- */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Stethoscope size={14} className="text-blue-500" /> Attending Physician Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Doctor's Name</label>
                        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 flex items-center gap-2">
                            <span className="text-slate-300"><UserCheck size={14} /></span>
                            {doctorName}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">Specialization</label>
                        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 flex items-center gap-2">
                            <span className="text-slate-300"><Briefcase size={14} /></span>
                            {specialization}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[9px] font-black text-slate-400 uppercase mb-1 ml-1">License Number</label>
                        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 flex items-center gap-2">
                            <span className="text-slate-300"><Hash size={14} /></span>
                            {licenseNo}
                        </div>
                    </div>
                </div>
                <p className="text-[9px] text-slate-400 mt-4 italic font-medium">
                    * These details will be printed on the official medical records and referrals.
                </p>
            </div>

            {/* Finalize Block */}
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-green-800 uppercase">Finalize Record</h4>
                        <p className="text-xs text-green-600">All data is validated and ready for the physician's signature.</p>
                    </div>
                </div>
                <button
                    onClick={onFinalize}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-green-700 transition-all active:scale-95"
                >
                    Save & Close Consult
                </button>
            </div>
        </div>
    );
};

export default AttachmentModule;