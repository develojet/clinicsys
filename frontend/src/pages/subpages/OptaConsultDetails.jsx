import React, { useState, useEffect } from 'react';
import {
    Eye, Clipboard, Activity, Stethoscope,
    FileText, Image as ImageIcon, ChevronRight,
    ChevronLeft, Save, ZoomIn, Pill, Paperclip
} from 'lucide-react';

// Shared Components
import PrescriptionModule from '../../components/consults/PrescriptionModule';
import AttachmentModule from '../../components/consults/AttachmentModule';

const OptaConsultDetails = ({ visitData, onSave }) => {
    const [currentStep, setCurrentStep] = useState(1);

    const [prescriptions, setPrescriptions] = useState([{ id: 1, med: '', dose: '', freq: '', duration: '' }]);
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        setCurrentStep(1);
    }, [visitData.id]);

    const steps = [
        { id: 1, label: "History", icon: Clipboard },
        { id: 2, label: "Vision", icon: Eye },
        { id: 3, label: "Exam", icon: ZoomIn },
        { id: 4, label: "Plan", icon: FileText },
        { id: 5, label: "Rx", icon: Pill },
        { id: 6, label: "Files", icon: Paperclip }
    ];

    const handleFinalize = () => {
        const finalData = {
            ...visitData,
            prescriptions,
            attachments,
            specialty: 'Ophthalmology',
            completedAt: new Date().toISOString()
        };
        if (onSave) onSave(finalData);
    };

    const InputField = ({ label, value, placeholder = "", type = "text", dark = false }) => (
        <div className="flex flex-col text-left">
            <label className="text-[10px] font-bold uppercase mb-1 tracking-tight text-slate-400">
                {label}
            </label>
            <input
                type={type}
                className={`border-b outline-none p-1 text-sm bg-transparent transition-colors ${
                    dark ? 'border-slate-700 text-white focus:border-emerald-400' : 'border-slate-200 focus:border-emerald-500 text-slate-800'
                }`}
                placeholder={placeholder}
                value={value}
                readOnly
            />
        </div>
    );

    // New "Remarks" component to replace the previous Attachment Placeholder
    const FindingsRemarks = ({ title, subtitle }) => (
        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 text-left flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <ImageIcon className="text-slate-300" size={14} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{title}</span>
            </div>
            {subtitle && <span className="text-[8px] text-slate-400 uppercase font-bold leading-none">{subtitle}</span>}
            <textarea
                className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-200 transition-all"
                rows="2"
                placeholder="Type findings or remarks..."
            />
        </div>
    );

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-6 md:p-10 relative animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header Badge */}
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-emerald-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-lg z-10">
                Ophthalmology Consultation #{visitData.id} — {visitData.date}
            </div>

            {/* Stepper Navigation */}
            <div className="flex justify-between items-center mb-10 px-2 mt-6 pt-4 overflow-x-auto pb-4">
                {steps.map((s, i) => (
                    <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center gap-2 min-w-[60px]">
                            <div
                                onClick={() => setCurrentStep(s.id)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${currentStep === s.id ? 'bg-emerald-600 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-300 border border-slate-200'}`}
                            >
                                <s.icon size={18} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${currentStep === s.id ? 'text-emerald-600' : 'text-slate-400'}`}>{s.label}</span>
                        </div>
                        {i !== steps.length - 1 && <div className="flex-1 h-px bg-slate-100 mx-1 mt-[-20px] min-w-[20px]" />}
                    </React.Fragment>
                ))}
            </div>

            {/* --- STEP 1: HISTORY --- */}
            {currentStep === 1 && (
                <div className="space-y-6 text-left animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Chief Complaint" value={visitData.complaint} />
                        <InputField label="Past Ocular History" placeholder="Previous surgeries, trauma, glaucoma..." />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">History of Present Illness</label>
                        <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm italic text-slate-600 outline-none focus:ring-1 focus:ring-emerald-200" rows="3" placeholder="Duration, severity, laterality..." />
                    </div>
                </div>
            )}

            {/* --- STEP 2: VISION & REFRACTION --- */}
            {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="text-[10px] font-black text-emerald-700 uppercase mb-4 tracking-widest border-b border-emerald-100 pb-1 text-left">Visual Acuity</h4>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="col-span-1"></div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase text-center">SC (Uncorrected)</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase text-center">CC (Corrected)</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase text-center">PH (Pinhole)</div>
                        </div>
                        {['OD (Right)', 'OS (Left)'].map((eye) => (
                            <div key={eye} className="grid grid-cols-4 gap-4 items-center mb-3">
                                <span className="text-[11px] font-bold text-slate-600">{eye}</span>
                                <input className="bg-white border border-slate-200 rounded p-2 text-center text-sm" placeholder="20/--" />
                                <input className="bg-white border border-slate-200 rounded p-2 text-center text-sm" placeholder="20/--" />
                                <input className="bg-white border border-slate-200 rounded p-2 text-center text-sm" placeholder="20/--" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- STEP 3: EXAM --- */}
            {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 p-4 rounded-xl text-white">
                        <InputField label="IOP (OD)" placeholder="mmHg" dark />
                        <InputField label="IOP (OS)" placeholder="mmHg" dark />
                        <InputField label="Method" placeholder="Applanation" dark />
                        <InputField label="Time" type="time" dark />
                    </div>

                    {/* Attachment Buttons removed, replaced with text remarks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FindingsRemarks title="External Exam" subtitle="Lids, Conjunctiva, Sclera" />
                        <FindingsRemarks title="Slit Lamp" subtitle="Cornea, AC, Lens" />
                        <FindingsRemarks title="Funduscopy (OD)" />
                        <FindingsRemarks title="Funduscopy (OS)" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase mb-3">Extraocular Muscles (EOM)</h4>
                            <textarea className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none" rows="2" placeholder="Motility findings..." />
                        </div>
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase mb-3">Dry Eye Tests</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Schirmer's" placeholder="mm" />
                                <InputField label="BUT" placeholder="seconds" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- STEP 4: ASSESSMENT & PLAN --- */}
            {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in text-left">
                    <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                        <label className="text-[11px] font-black text-emerald-700 uppercase mb-3 block">Assessment / Diagnosis</label>
                        <textarea className="w-full bg-white border border-emerald-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-100" rows="3" />
                    </div>
                </div>
            )}

            {/* --- STEP 5: PRESCRIPTION --- */}
            {currentStep === 5 && (
                <PrescriptionModule prescriptions={prescriptions} setPrescriptions={setPrescriptions} />
            )}

            {/* --- STEP 6: ATTACHMENTS --- */}
            {currentStep === 6 && (
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
                    className={`text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1 ${currentStep === steps.length ? 'invisible' : 'hover:text-emerald-700'}`}
                >
                    Next Section <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default OptaConsultDetails;