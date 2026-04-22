import React, { useState, useEffect } from 'react';
import {
    Clipboard, Activity, Stethoscope,
    FileText, ChevronRight, ChevronLeft,
    Pill, Paperclip
} from 'lucide-react';

// Shared Components
import PrescriptionModule from '../../components/consults/PrescriptionModule';
import AttachmentModule from '../../components/consults/AttachmentModule';

const ENTConsultDetails = ({ visitData, onSave }) => {
    const [currentStep, setCurrentStep] = useState(1);

    // Local state for the shared modules
    const [prescriptions, setPrescriptions] = useState([{ id: 1, med: '', dose: '', freq: '', duration: '' }]);
    const [attachments, setAttachments] = useState([]);

    // Reset to step 1 when the selected patient visit changes
    useEffect(() => {
        setCurrentStep(1);
    }, [visitData.id]);

    const steps = [
        { id: 1, label: "History", icon: Clipboard },
        { id: 2, label: "ROS", icon: Activity },
        { id: 3, label: "Exam", icon: Stethoscope },
        { id: 4, label: "Plan", icon: FileText },
        { id: 5, label: "Rx", icon: Pill },
        { id: 6, label: "Files", icon: Paperclip }
    ];

    const handleFinalize = () => {
        const finalData = {
            ...visitData,
            prescriptions,
            attachments,
            specialty: 'ENT',
            completedAt: new Date().toISOString()
        };
        console.log("Saving ENT Consult:", finalData);
        if (onSave) onSave(finalData);
    };

    const InputField = ({ label, value, placeholder = "", type = "text", dark = false }) => (
        <div className="flex flex-col text-left">
            <label className={`text-[10px] font-bold uppercase mb-1 tracking-tight ${dark ? 'text-slate-400' : 'text-slate-400'}`}>
                {label}
            </label>
            <input
                type={type}
                className={`border-b outline-none p-1 text-sm bg-transparent transition-colors ${
                    dark ? 'border-slate-700 text-white focus:border-blue-400' : 'border-slate-200 focus:border-blue-500 text-slate-800'
                }`}
                placeholder={placeholder}
                value={value}
                readOnly
            />
        </div>
    );

    const CheckboxField = ({ label, checked }) => (
        <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-300'}`}>
                {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <span className="text-[11px] text-slate-600 uppercase font-semibold">{label}</span>
        </label>
    );

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-10 relative animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header Badge */}
            <div className="absolute top-0 left-10 -translate-y-1/2 bg-slate-900 text-white px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-lg z-10">
                ENT Consultation #{visitData.id} — {visitData.date}
            </div>

            {/* Stepper Navigation */}
            <div className="flex justify-between items-center mb-10 px-2 mt-6 pt-4 overflow-x-auto pb-4">
                {steps.map((s, i) => (
                    <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center gap-2 min-w-[60px]">
                            <div
                                onClick={() => setCurrentStep(s.id)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${currentStep === s.id ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-300 border border-slate-200'}`}
                            >
                                <s.icon size={18} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${currentStep === s.id ? 'text-blue-600' : 'text-slate-400'}`}>{s.label}</span>
                        </div>
                        {i !== steps.length - 1 && <div className="flex-1 h-px bg-slate-100 mx-1 mt-[-20px] min-w-[20px]" />}
                    </React.Fragment>
                ))}
            </div>

            {/* STEP 1: HISTORY */}
            {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Chief Complaint</label>
                            <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm italic text-slate-600" rows="2" value={visitData.complaint} readOnly />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">HPI</label>
                            <textarea className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50" rows="3" placeholder="Duration, onset, associated symptoms..." />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-100">
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-blue-600 uppercase border-b border-blue-100 pb-1">Specialty History</h4>
                            {['Hearing Loss', 'Tinnitus', 'Allergic Rhinitis', 'Frequent Tonsillitis'].map(m => <CheckboxField key={m} label={m} />)}
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-blue-600 uppercase border-b border-blue-100 pb-1">Past Surgical</h4>
                            {['Tonsillectomy', 'Septoplasty', 'Myringotomy'].map(f => <CheckboxField key={f} label={f} />)}
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-blue-600 uppercase border-b border-blue-100 pb-1">Social</h4>
                            <InputField label="Smoking / Vaping" placeholder="yrs..." />
                            <InputField label="Occupation" placeholder="Noise exposure?" />
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: ROS (ENT Focused) */}
            {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in text-left">
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 pb-1">Ear</h4>
                        {['Otalgia', 'Otorrhea', 'Vertigo', 'Itchiness'].map(s => <CheckboxField key={s} label={s} />)}
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 pb-1">Nose / Sinus</h4>
                        {['Congestion', 'Epistaxis', 'Post-nasal drip', 'Anosmia'].map(s => <CheckboxField key={s} label={s} />)}
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 pb-1">Throat / Neck</h4>
                        {['Dysphagia', 'Hoarseness', 'Odynophagia', 'Lump in neck'].map(s => <CheckboxField key={s} label={s} />)}
                    </div>
                </div>
            )}

            {/* STEP 3: EXAM (ENT Focused) */}
            {currentStep === 3 && (
                <div className="space-y-10 animate-in fade-in">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl grid grid-cols-4 lg:grid-cols-8 gap-4 shadow-xl">
                        {['BP', 'PR', 'RR', 'Temp', 'WT', 'HT', 'BMI', 'Pain'].map(v => (
                            <InputField key={v} label={v} dark={true} />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-blue-600 uppercase mb-4 tracking-wider">Otoscopy</h4>
                            <InputField label="Right Ear" placeholder="TM description..." />
                            <InputField label="Left Ear" placeholder="TM description..." />
                        </div>
                        <div className="col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4">Anterior Rhinoscopy / Pharyngoscopy</h4>
                            <textarea className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-50" rows="5" placeholder="Document turbinates, septum, tonsils, etc..." />
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: ASSESSMENT & PLAN */}
            {currentStep === 4 && (
                <div className="space-y-8 animate-in fade-in text-left">
                    <div className="bg-white border-2 border-dashed border-blue-100 p-6 rounded-2xl">
                        <label className="text-[11px] font-black text-blue-700 uppercase mb-3 block">ENT Clinical Impression</label>
                        <textarea className="w-full bg-white border border-blue-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100" rows="3" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase mb-3 block">Management Plan</label>
                        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm outline-none" rows="4" placeholder="Procedures, home care, follow-up..." />
                    </div>
                </div>
            )}

            {/* STEP 5: PRESCRIPTION (REUSABLE) */}
            {currentStep === 5 && (
                <PrescriptionModule
                    prescriptions={prescriptions}
                    setPrescriptions={setPrescriptions}
                />
            )}

            {/* STEP 6: ATTACHMENTS (REUSABLE) */}
            {currentStep === 6 && (
                <AttachmentModule onFinalize={handleFinalize} />
            )}

            {/* Step Controls */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
                <button
                    onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                    className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${currentStep === 1 ? 'invisible' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <ChevronLeft size={16} /> Previous
                </button>

                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Step {currentStep} of {steps.length}
                </span>

                <button
                    onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length))}
                    className={`text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1 ${currentStep === steps.length ? 'invisible' : 'hover:text-blue-700'}`}
                >
                    Next Section <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default ENTConsultDetails;