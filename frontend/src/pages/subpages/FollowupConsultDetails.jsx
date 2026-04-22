import React, { useState, useEffect } from 'react';
import {
    RefreshCcw, FileText, ClipboardList,
    Activity, ClipboardCheck, Save,
    ChevronRight, ChevronLeft, Pill, Paperclip
} from 'lucide-react';

// Shared Components
import PrescriptionModule from '../../components/consults/PrescriptionModule';
import AttachmentModule from '../../components/consults/AttachmentModule';

const FollowupConsultDetails = ({ visitData, onSave }) => {
    const [currentStep, setCurrentStep] = useState(1);

    // Local state for shared modules
    const [prescriptions, setPrescriptions] = useState([{ id: 1, med: '', dose: '', freq: '', duration: '' }]);
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        setCurrentStep(1);
    }, [visitData.id]);

    const steps = [
        { id: 1, label: "Vitals", icon: Activity },
        { id: 2, label: "Subjective", icon: ClipboardList },
        { id: 3, label: "Objective", icon: RefreshCcw },
        { id: 4, label: "Assessment", icon: ClipboardCheck },
        { id: 5, label: "Rx", icon: Pill },
        { id: 6, label: "Files", icon: Paperclip }
    ];

    const handleFinalize = () => {
        const finalData = {
            ...visitData,
            prescriptions,
            attachments,
            consultType: 'Follow-up',
            completedAt: new Date().toISOString()
        };
        console.log("Saving Follow-up Consult:", finalData);
        if (onSave) onSave(finalData);
    };

    // Utility for structured SOAP sections
    const SOAPSection = ({ title, icon: Icon, color, placeholder }) => (
        <div className={`mb-6 p-6 rounded-2xl border ${color.bg} ${color.border} text-left animate-in fade-in duration-500`}>
            <div className="flex items-center gap-2 mb-4">
                <Icon size={18} className={color.text} />
                <h4 className={`text-[11px] font-black uppercase tracking-widest ${color.text}`}>{title}</h4>
            </div>
            <textarea
                className="w-full bg-white/50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-slate-100 transition-all text-slate-700"
                rows="6"
                placeholder={placeholder}
            />
        </div>
    );

    const VitalField = ({ label, value }) => (
        <div className="flex flex-col border-r border-slate-100 last:border-none px-4 flex-1 text-left">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{label}</span>
            <span className="text-sm font-black text-slate-700">{value || '--'}</span>
        </div>
    );

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-10 relative animate-in fade-in slide-in-from-top-4 duration-500">

            {/* Header Badge */}
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-slate-800 text-white px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-lg z-10">
                Follow-up Consultation #{visitData.id} — {visitData.date}
            </div>

            {/* Stepper Navigation */}
            <div className="flex justify-between items-center mb-10 px-2 mt-6 pt-4 overflow-x-auto pb-4">
                {steps.map((s, i) => (
                    <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center gap-2 min-w-[70px]">
                            <div
                                onClick={() => setCurrentStep(s.id)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${currentStep === s.id ? 'bg-slate-900 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-300 border border-slate-200'}`}
                            >
                                <s.icon size={18} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${currentStep === s.id ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
                        </div>
                        {i !== steps.length - 1 && <div className="flex-1 h-px bg-slate-100 mx-1 mt-[-20px] min-w-[20px]" />}
                    </React.Fragment>
                ))}
            </div>

            {/* --- STEP 1: VITALS --- */}
            {currentStep === 1 && (
                <div className="animate-in fade-in space-y-8">
                    <div className="flex justify-between items-start text-left">
                        <div>
                            <h2 className="text-[20px] font-black text-slate-800 tracking-tight flex items-center gap-3">
                                <Activity size={20} className="text-slate-800" />
                                Vital Signs
                            </h2>
                        </div>
                        {/*<div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-right">*/}
                        {/*    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Consult Date</span>*/}
                        {/*    <span className="text-sm font-black text-slate-700">{visitData.date}</span>*/}
                        {/*</div>*/}
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 flex flex-wrap gap-y-4 justify-between items-center border border-slate-100">
                        <VitalField label="PR" value={visitData.pr} />
                        <VitalField label="RR" value={visitData.rr} />
                        <VitalField label="BP" value={visitData.bp} />
                        <VitalField label="Temp" value={visitData.temp} />
                        <VitalField label="Weight" value={visitData.weight} />
                        <VitalField label="Height" value={visitData.height} />
                        <VitalField label="BMI" value={visitData.bmi} />
                    </div>
                </div>
            )}

            {/* --- STEP 2: SUBJECTIVE --- */}
            {currentStep === 2 && (
                <div className="animate-in fade-in">
                    <SOAPSection
                        title="Subjective"
                        icon={ClipboardList}
                        color={{ bg: 'bg-white', border: 'border-slate-200', text: 'text-slate-500' }}
                        placeholder="Interval history since last visit, new complaints, or response to previous treatment..."
                    />
                </div>
            )}

            {/* --- STEP 3: OBJECTIVE --- */}
            {currentStep === 3 && (
                <div className="animate-in fade-in">
                    <SOAPSection
                        title="Objective"
                        icon={Activity}
                        color={{ bg: 'bg-white', border: 'border-slate-200', text: 'text-slate-500' }}
                        placeholder="Physical examination findings, focused exam results, or reviewed laboratory/imaging results..."
                    />
                </div>
            )}

            {/* --- STEP 4: ASSESSMENT & PLAN --- */}
            {currentStep === 4 && (
                <div className="animate-in fade-in space-y-4">
                    <SOAPSection
                        title="Assessment"
                        icon={ClipboardCheck}
                        color={{ bg: 'bg-slate-50/50', border: 'border-slate-200', text: 'text-slate-700' }}
                        placeholder="Current Clinical Impression..."
                    />
                    <SOAPSection
                        title="Plan of Management"
                        icon={FileText}
                        color={{ bg: 'bg-slate-900', border: 'border-slate-800', text: 'text-slate-300' }}
                        placeholder="Diagnostic tests, health education, or disposition instructions..."
                    />
                    <div className="flex gap-6 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase">Admitted</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase">Discharged w/ Rx</span>
                        </label>
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

            {/* Navigation Footer */}
            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
                <button
                    onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                    className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${currentStep === 1 ? 'invisible' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <ChevronLeft size={16} /> Previous
                </button>

                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Step {currentStep} of {steps.length}
                </span>

                <button
                    onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length))}
                    className={`text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-1 transition-colors ${currentStep === steps.length ? 'invisible' : 'hover:text-black'}`}
                >
                    Next Section <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default FollowupConsultDetails;