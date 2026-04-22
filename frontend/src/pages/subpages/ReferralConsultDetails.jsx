import React, { useState, useEffect } from 'react';
import {
    ArrowRightLeft, FileText, ClipboardList,
    Stethoscope, Save, AlertCircle, ChevronRight,
    ChevronLeft, Pill, Paperclip, Clipboard
} from 'lucide-react';

// Shared Components
import PrescriptionModule from '../../components/consults/PrescriptionModule';
import AttachmentModule from '../../components/consults/AttachmentModule';

const ReferralConsultDetails = ({ visitData, onSave }) => {
    const [currentStep, setCurrentStep] = useState(1);

    // Local state for shared modules
    const [prescriptions, setPrescriptions] = useState([{ id: 1, med: '', dose: '', freq: '', duration: '' }]);
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        setCurrentStep(1);
    }, [visitData.id]);

    const steps = [
        { id: 1, label: "Coordination", icon: ArrowRightLeft },
        { id: 2, label: "Reason", icon: AlertCircle },
        { id: 3, label: "Evaluation", icon: ClipboardList },
        { id: 4, label: "Plan", icon: FileText },
        { id: 5, label: "Rx", icon: Pill },
        { id: 6, label: "Files", icon: Paperclip }
    ];

    const handleFinalize = () => {
        const finalData = {
            ...visitData,
            prescriptions,
            attachments,
            type: 'Referral',
            completedAt: new Date().toISOString()
        };
        console.log("Submitting Referral:", finalData);
        if (onSave) onSave(finalData);
    };

    // Internal UI Components
    const DeptBox = ({ title, color, children }) => (
        <div className={`flex-1 p-6 rounded-2xl border ${color.bg} ${color.border} text-left`}>
            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${color.text}`}>
                {title}
            </h4>
            <div className="space-y-4">{children}</div>
        </div>
    );

    const DataRow = ({ label, value }) => (
        <div className="flex flex-col border-b border-slate-100 pb-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{label}</span>
            <span className="text-sm font-bold text-slate-800">{value || '---'}</span>
        </div>
    );

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-10 relative animate-in fade-in slide-in-from-top-4 duration-500">

            {/* Header Badge */}
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-amber-500 text-white px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-lg z-10">
                Interdepartmental Referral
            </div>

            {/* Stepper Navigation */}
            <div className="flex justify-between items-center mb-10 px-2 mt-6 pt-4 overflow-x-auto pb-4">
                {steps.map((s, i) => (
                    <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center gap-2 min-w-[70px]">
                            <div
                                onClick={() => setCurrentStep(s.id)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${currentStep === s.id ? 'bg-amber-500 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-300 border border-slate-200'}`}
                            >
                                <s.icon size={18} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${currentStep === s.id ? 'text-amber-600' : 'text-slate-400'}`}>{s.label}</span>
                        </div>
                        {i !== steps.length - 1 && <div className="flex-1 h-px bg-slate-100 mx-1 mt-[-20px] min-w-[20px]" />}
                    </React.Fragment>
                ))}
            </div>

            {/* --- STEP 1: COORDINATION --- */}
            {currentStep === 1 && (
                <div className="flex flex-col md:row gap-6 animate-in fade-in">
                    <DeptBox title="Referring Department" color={{ bg: 'bg-white', border: 'border-slate-200', text: 'text-slate-400' }}>
                        <DataRow label="Date Referred" value={visitData.date} />
                        <DataRow label="Service Team" value={visitData.referringService || 'Pedia'} />
                        <DataRow label="Referred By" value={visitData.doctor} />
                    </DeptBox>

                    <DeptBox title="Receiving Department" color={{ bg: 'bg-slate-50/50', border: 'border-slate-200', text: 'text-slate-400' }}>
                        <DataRow label="Date Received" value="---" />
                        <DataRow label="Time" value="---" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Emergency?</span>
                            <input type="checkbox" className="mt-1 w-4 h-4 rounded text-amber-500 border-slate-300" />
                        </div>
                    </DeptBox>
                </div>
            )}

            {/* --- STEP 2: REASON & IMPRESSION --- */}
            {currentStep === 2 && (
                <div className="space-y-6 text-left animate-in fade-in">
                    <div className="p-6 rounded-2xl border border-amber-100 bg-amber-50/30">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-600 mb-4">Initial Impression / Diagnosis</h4>
                        <textarea
                            className="w-full bg-white border border-amber-100 rounded-xl p-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-amber-200"
                            rows="3"
                            defaultValue={visitData.complaint}
                        />
                    </div>

                    <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Reason for Referral</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['Transfer of Service', 'Co-Management', 'Evaluation', 'Cardiopulmonary Risk'].map((reason) => (
                                <label key={reason} className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="rounded text-amber-500 border-slate-300" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase group-hover:text-slate-700">{reason}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- STEP 3: EVALUATION --- */}
            {currentStep === 3 && (
                <div className="space-y-6 text-left animate-in fade-in">
                    <div className="border-l-4 border-amber-500 pl-6 py-2">
                        <div className="flex items-center gap-2 mb-2 text-slate-400">
                            <ClipboardList size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Clinical Evaluation</span>
                        </div>
                        <textarea
                            className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-amber-100"
                            rows="8"
                            placeholder="Detailed physical exam findings, current status, and specific concerns..."
                        />
                    </div>
                </div>
            )}

            {/* --- STEP 4: PLAN --- */}
            {currentStep === 4 && (
                <div className="space-y-6 text-left animate-in fade-in">
                    <div className="border-l-4 border-slate-200 pl-6 py-2">
                        <div className="flex items-center gap-2 mb-2 text-slate-400">
                            <FileText size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Suggested Plan / Instructions</span>
                        </div>
                        <textarea
                            className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-slate-100"
                            rows="6"
                            placeholder="Interim management, required diagnostics, or transfer preparations..."
                        />
                    </div>
                </div>
            )}

            {/* --- STEP 5: PRESCRIPTION --- */}
            {currentStep === 5 && (
                <PrescriptionModule
                    prescriptions={prescriptions}
                    setPrescriptions={setPrescriptions}
                />
            )}

            {/* --- STEP 6: ATTACHMENTS --- */}
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
                    className={`text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1 ${currentStep === steps.length ? 'invisible' : 'hover:text-amber-700'}`}
                >
                    Next Section <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default ReferralConsultDetails;