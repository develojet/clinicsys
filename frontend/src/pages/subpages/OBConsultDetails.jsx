import React, { useState, useEffect } from 'react';
import {
    User, Clipboard, Heart, Save, ChevronRight, ChevronLeft,
    CheckCircle2, AlertCircle, Stethoscope, Activity, FileText,
    Pill, Paperclip
} from 'lucide-react';

// Shared Components
import PrescriptionModule from '../../components/consults/PrescriptionModule';
import AttachmentModule from '../../components/consults/AttachmentModule';

const OBConsultDetails = ({ visitData, onSave }) => {
    const [currentStep, setCurrentStep] = useState(1);

    // Local state for shared modules
    const [prescriptions, setPrescriptions] = useState([{ id: 1, med: '', dose: '', freq: '', duration: '' }]);
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        setCurrentStep(1);
    }, [visitData.id]);

    const steps = [
        { id: 1, label: "History", icon: Clipboard },
        { id: 2, label: "OB Score", icon: Heart },
        { id: 3, label: "Review", icon: AlertCircle },
        { id: 4, label: "Exam", icon: Stethoscope },
        { id: 5, label: "Plan", icon: FileText },
        { id: 6, label: "Rx", icon: Pill },
        { id: 7, label: "Files", icon: Paperclip }
    ];

    const handleFinalize = () => {
        const finalData = {
            ...visitData,
            prescriptions,
            attachments,
            specialty: 'OB-GYN',
            completedAt: new Date().toISOString()
        };
        console.log("Saving OB Record:", finalData);
        if (onSave) onSave(finalData);
    };

    const InputField = ({ label, value, placeholder = "", type = "text" }) => (
        <div className="flex flex-col text-left">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-tight">{label}</label>
            <input
                type={type}
                className="border-b border-slate-200 focus:border-pink-500 outline-none p-1 text-sm bg-transparent transition-colors text-slate-800"
                placeholder={placeholder}
                value={value}
                readOnly
            />
        </div>
    );

    const CheckboxField = ({ label, checked }) => (
        <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${checked ? 'bg-pink-600 border-pink-600' : 'border-slate-300'}`}>
                {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <span className="text-[11px] text-slate-600 uppercase font-semibold">{label}</span>
        </label>
    );

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-6 md:p-10 relative animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header Badge */}
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-pink-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg z-10">
                {visitData.type} Consultation #{visitData.id} — {visitData.date}
            </div>

            {/* Stepper Navigation */}
            <div className="flex justify-between items-center mb-10 px-2 mt-6 pt-4 overflow-x-auto pb-4">
                {steps.map((s, i) => (
                    <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center gap-2 min-w-[60px]">
                            <div
                                onClick={() => setCurrentStep(s.id)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${currentStep === s.id ? 'bg-pink-600 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-300 border border-slate-200'}`}
                            >
                                <s.icon size={18} />
                            </div>
                            <span className={`text-[9px] font-bold uppercase ${currentStep === s.id ? 'text-pink-600' : 'text-slate-400'}`}>{s.label}</span>
                        </div>
                        {i !== steps.length - 1 && <div className="flex-1 h-px bg-slate-100 mx-1 mt-[-20px] min-w-[20px]" />}
                    </React.Fragment>
                ))}
            </div>

            {/* STEP 1: HISTORY */}
            {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in text-left">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputField label="% Reliability" value="95%" />
                        <InputField label="Informant" value="Patient" />
                        <InputField label="Staff" value="Nurse Joy" />
                    </div>
                    <InputField label="Chief Complaint" value={visitData.complaint} />
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">HPI</label>
                        <textarea className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-1 focus:ring-pink-200" rows="3" placeholder="Timeline of present illness..." />
                    </div>
                </div>
            )}

            {/* STEP 2: OB SCORE */}
            {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in text-left">
                    <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100">
                        <h3 className="text-[10px] font-black text-pink-700 uppercase mb-4 flex items-center gap-2"><Heart size={14}/> Clinical OB Score</h3>
                        <div className="grid grid-cols-6 gap-2">
                            {['G', 'P', 'T', 'P', 'A', 'L'].map((label, idx) => (
                                <div key={idx} className="text-center">
                                    <label className="text-[9px] font-bold text-pink-400 block mb-1">{label}</label>
                                    <input type="text" className="w-full text-center font-bold text-pink-900 bg-white border border-pink-200 rounded p-2 outline-none" defaultValue="0" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <InputField label="LNMP" type="date" />
                        <InputField label="EDC" type="date" />
                    </div>
                </div>
            )}

            {/* STEP 3: REVIEW OF SYSTEMS */}
            {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in text-left">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase border-b pb-1">Danger Signs</h4>
                        <CheckboxField label="Vaginal Bleeding" checked={false} />
                        <CheckboxField label="Severe Headache" checked={false} />
                        <CheckboxField label="Blurring of Vision" checked={false} />
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase border-b pb-1">General Review</h4>
                        <CheckboxField label="Edema / Swelling" checked={false} />
                        <CheckboxField label="Fever / Chills" checked={false} />
                        <CheckboxField label="Decreased Fetal Movement" checked={false} />
                    </div>
                </div>
            )}

            {/* STEP 4: PHYSICAL EXAM */}
            {currentStep === 4 && (
                <div className="space-y-8 animate-in fade-in text-left">
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-xl">
                        <InputField label="BP" placeholder="120/80" />
                        <InputField label="WT (kg)" />
                        <InputField label="HR" />
                        <InputField label="RR" />
                        <InputField label="TEMP" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-pink-600 uppercase flex items-center gap-2"><Activity size={12}/> Uterine Data</h4>
                            <InputField label="Fundal Height (cm)" />
                            <InputField label="Fetal Heart Tone (bpm)" />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-pink-600 uppercase flex items-center gap-2"><Stethoscope size={12}/> Leopold's Maneuver</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <InputField label="L1" /><InputField label="L2" />
                                <InputField label="L3" /><InputField label="L4" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 5: PLAN */}
            {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in text-left">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Clinical Impression</label>
                        <textarea className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm outline-none" rows="3" placeholder="Diagnosis..." />
                    </div>
                    <div className="bg-pink-50/30 p-4 rounded-xl border border-pink-100">
                        <label className="text-[10px] font-bold text-pink-700 uppercase block mb-2">Management Plan</label>
                        <textarea className="w-full p-3 bg-white border border-pink-100 rounded-lg text-sm outline-none" rows="3" placeholder="Labs, Advice, Disposition..." />
                    </div>
                    <div className="pt-2">
                        <InputField label="Follow-up Date" type="date" />
                    </div>
                </div>
            )}

            {/* STEP 6: PRESCRIPTION */}
            {currentStep === 6 && (
                <PrescriptionModule
                    prescriptions={prescriptions}
                    setPrescriptions={setPrescriptions}
                />
            )}

            {/* STEP 7: ATTACHMENTS */}
            {currentStep === 7 && (
                <AttachmentModule onFinalize={handleFinalize} />
            )}

            {/* Navigation Footer */}
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
                    className={`text-[10px] font-black uppercase tracking-widest text-pink-600 flex items-center gap-1 ${currentStep === steps.length ? 'invisible' : 'hover:text-pink-700'}`}
                >
                    Next Section <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default OBConsultDetails;