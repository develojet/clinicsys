import React, { useState, useEffect } from 'react';
import {
    Baby, Clipboard, ShieldCheck, Activity,
    FileText, TrendingUp, ChevronRight, ChevronLeft, Save,
    Pill, Paperclip
} from 'lucide-react';

// Shared Components
import PrescriptionModule from '../../components/consults/PrescriptionModule';
import AttachmentModule from '../../components/consults/AttachmentModule';

const PediaConsultDetails = ({ visitData, onSave }) => {
    const [currentStep, setCurrentStep] = useState(1);

    // Local state for shared modules
    const [prescriptions, setPrescriptions] = useState([{ id: 1, med: '', dose: '', freq: '', duration: '' }]);
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        setCurrentStep(1);
    }, [visitData.id]);

    const steps = [
        { id: 1, label: "History", icon: Clipboard },
        { id: 2, label: "Vaccines", icon: ShieldCheck },
        { id: 3, label: "Growth", icon: TrendingUp },
        { id: 4, label: "Assessment", icon: FileText },
        { id: 5, label: "Rx", icon: Pill },
        { id: 6, label: "Files", icon: Paperclip }
    ];

    const handleFinalize = () => {
        const finalData = {
            ...visitData,
            prescriptions,
            attachments,
            specialty: 'Pediatrics',
            completedAt: new Date().toISOString()
        };
        console.log("Saving Pediatric Record:", finalData);
        if (onSave) onSave(finalData);
    };

    const InputField = ({ label, value, placeholder = "", type = "text" }) => (
        <div className="flex flex-col text-left">
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-tight">{label}</label>
            <input
                type={type}
                className="border-b border-slate-200 focus:border-cyan-500 outline-none p-1 text-sm bg-transparent transition-colors text-slate-800"
                placeholder={placeholder}
                value={value}
                readOnly
            />
        </div>
    );

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-cyan-100 p-6 md:p-10 relative animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header Badge */}
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-cyan-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-lg z-10">
                Pediatric Consultation #{visitData.id} — {visitData.date}
            </div>

            {/* Stepper Navigation */}
            <div className="flex justify-between items-center mb-10 px-2 mt-6 pt-4 overflow-x-auto pb-4">
                {steps.map((s, i) => (
                    <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center gap-2 min-w-[65px]">
                            <div
                                onClick={() => setCurrentStep(s.id)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${currentStep === s.id ? 'bg-cyan-600 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-300 border border-slate-200'}`}
                            >
                                <s.icon size={18} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${currentStep === s.id ? 'text-cyan-600' : 'text-slate-400'}`}>{s.label}</span>
                        </div>
                        {i !== steps.length - 1 && <div className="flex-1 h-px bg-slate-100 mx-1 mt-[-20px] min-w-[20px]" />}
                    </React.Fragment>
                ))}
            </div>

            {/* --- STEP 1: HISTORY --- */}
            {currentStep === 1 && (
                <div className="space-y-8 text-left animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-cyan-700 uppercase tracking-widest border-b border-cyan-100 pb-1">Birth History</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Birthplace" placeholder="Hosp/Lying-in" />
                                <InputField label="Delivery Type" placeholder="NSD/CS" />
                                <InputField label="Birth Weight (kg)" />
                                <InputField label="APGAR Score" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-cyan-700 uppercase tracking-widest border-b border-cyan-100 pb-1">Maternal History</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Maternal Age" />
                                <InputField label="OB Score" />
                                <InputField label="PNCU" placeholder="HC/Clinic" />
                                <InputField label="Infections" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- STEP 2: IMMUNIZATION --- */}
            {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                        <table className="w-full text-left text-[10px]">
                            <thead className="bg-slate-50 text-slate-400 font-bold uppercase">
                            <tr>
                                <th className="p-3">Vaccine</th>
                                <th className="p-3 text-center">1</th>
                                <th className="p-3 text-center">2</th>
                                <th className="p-3 text-center">3</th>
                                <th className="p-3 text-center">B1</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-medium">
                            {['BCG', 'DPT', 'OPV/IPV', 'HEP B', 'MMR', 'HIB', 'PCV'].map((v) => (
                                <tr key={v} className="hover:bg-cyan-50/30">
                                    <td className="p-3 font-bold text-slate-700">{v}</td>
                                    {[1, 2, 3, 4].map(d => (
                                        <td key={d} className="p-3 text-center">
                                            <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- STEP 3: DEVELOPMENT & NUTRITION --- */}
            {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in text-left">
                    <div className="bg-cyan-50/30 p-6 rounded-2xl border border-cyan-100">
                        <h4 className="text-[10px] font-black text-cyan-700 uppercase mb-4 tracking-widest border-b border-cyan-100 pb-1">Nutritional History</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Infant Feeding" placeholder="Breastfed/Mixed" />
                            <InputField label="Complementary" placeholder="Age introduced" />
                            <InputField label="Introduced Foods" />
                            <InputField label="Allergies" />
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Developmental Milestones</label>
                        <textarea className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm outline-none" rows="3" placeholder="Motor, Language, and Social milestones..." />
                    </div>
                </div>
            )}

            {/* --- STEP 4: ASSESSMENT & PLAN --- */}
            {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in text-left">
                    <div className="bg-cyan-50/50 p-6 rounded-2xl border border-cyan-100">
                        <label className="text-[11px] font-black text-cyan-700 uppercase mb-3 block">Clinical Impression</label>
                        <textarea className="w-full bg-white border border-cyan-200 rounded-lg p-3 text-sm outline-none" rows="3" />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <label className="text-[11px] font-black text-slate-500 uppercase mb-3 block">General Management Plan</label>
                        <textarea className="w-full border-none bg-transparent outline-none text-sm" rows="4" placeholder="Feeding, health education, etc..." />
                    </div>
                    <InputField label="Follow-up Date" type="date" />
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
                    className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${currentStep === 1 ? 'invisible' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <ChevronLeft size={16} /> Previous
                </button>

                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Step {currentStep} of {steps.length}
                </span>

                <button
                    onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length))}
                    className={`text-[10px] font-black uppercase tracking-widest text-cyan-600 flex items-center gap-1 ${currentStep === steps.length ? 'invisible' : 'hover:text-cyan-700'}`}
                >
                    Next Section <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default PediaConsultDetails;