// src/components/consults/PrescriptionModule.jsx
import React from 'react';
import { Pill, PlusCircle, Trash2, Printer } from 'lucide-react';

const PrescriptionModule = ({ prescriptions, setPrescriptions }) => {
    const addMedicine = () => {
        setPrescriptions([...prescriptions, { id: Date.now(), med: '', dose: '', freq: '', duration: '' }]);
    };

    const removeMedicine = (id) => {
        setPrescriptions(prescriptions.filter(rx => rx.id !== id));
    };

    return (
        <div className="space-y-6 animate-in fade-in text-left">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Pill className="text-blue-600" size={18} /> Electronic Prescription
                </h4>
                <button
                    onClick={addMedicine}
                    className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-100 uppercase flex items-center gap-1 hover:bg-blue-100 transition-colors"
                >
                    <PlusCircle size={14} /> Add Medicine
                </button>
            </div>

            <div className="space-y-3">
                {prescriptions.map((rx) => (
                    <div key={rx.id} className="grid grid-cols-12 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 items-end">
                        <div className="col-span-5">
                            <label className="text-[9px] font-black text-slate-400 uppercase">Medication Name</label>
                            <input className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" placeholder="e.g. Amoxicillin 500mg" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase">Sig / Dosage</label>
                            <input className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" placeholder="1 tab" />
                        </div>
                        <div className="col-span-3">
                            <label className="text-[9px] font-black text-slate-400 uppercase">Frequency</label>
                            <input className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs" placeholder="3x a day" />
                        </div>
                        <div className="col-span-2 flex justify-end">
                            <button
                                onClick={() => removeMedicine(rx.id)}
                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-6 flex justify-end">
                <button className="flex items-center gap-2 text-xs font-bold text-slate-500 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all">
                    <Printer size={16} /> Preview & Print Rx
                </button>
            </div>
        </div>
    );
};

export default PrescriptionModule;