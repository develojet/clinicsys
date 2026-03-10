import React, { useState, useEffect } from 'react';
import {
    User, Clipboard, Activity, Stethoscope,
    Heart, Save, ChevronRight, ChevronLeft,
    CheckCircle2, AlertCircle, FileText
} from 'lucide-react';

const FullOBConsult = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Patient Details
        familyName: '', givenName: '', middleName: '', birthDate: '', age: '', sex: 'Female', status: '', date: '', time: '',
        address: '', telNo: '', occupation: '', employerAddress: '', nameOfSpouse: '',
        // General
        reliability: '', informant: '', personnel: '', chiefComplaint: '', hpi: '', accompanyingPerson: '', relation: '',
        // PMH/Surgical
        pmh: { allergy: false, asthma: false, heart: false, hpn: false, dm: false, tb: false, convulsion: false, others: '', hosp: '', surgery: '', immunizations: '' },
        familyHistory: { none: false, dm: false, heart: false, hpn: false, cancer: false, atopy: false, others: '' },
        social: { smoking: '', alcohol: '', diet: '', drugs: '', exercise: '', household: '', water: '', toilet: '', garbage: '', prevalence: '' },
        menstrual: { menarche: '', interval: '', duration: '', amount: '', dysmenorrhea: false, coitarche: '', partner: '', concerns: '', infection: '' },
        obHistory: { g: '', p: '', t: '', p1: '', a: '', l: '', lnmp: '', pmp: '', aog: '', edc: '', fp: '', procedures: { papsmear: '', ultrasound: '', mammography: '', others: '' }, presentPregnancy: '' },
        // ROS
        ros: { headache: false, dizziness: false, migraine: false, blurVision: false, visualLoss: false, decHearing: false, tinnitus: false, noseBleed: false, rosOthers1: '',
            dyspnea: false, wheezing: false, tachypnea: false, cough: false, hemoptysis: false, rosOthers2: '',
            chestPain: false, palpitations: false, easilyFatigue: false, orthopnea: false, pud: false, rosOthers3: '',
            hematemesis: false, constipation: false, diarrhea: false, hematochezia: false, dyspepsia: false, abdominalPain: false, melena: false, rosOthers4: '',
            neckPain: false, jointPain: false, backPain: false, musclePain: false, rosOthers5: '',
            paresthesia: false, weakness: false, syncope: false, convulsion: false, depression: false, hallucination: false, rosOthers6: '',
            fever: false, chills: false, jaundice: false, malaise: false, rosOthers7: '' },
        // Vitals/Anthropometrics
        vitals: { pr: '', rr: '', bp: '', temp: '', pain: '', weight: '', height: '', bmi: '' },
        peNormal: { heent: false, breast: false, chest: false, heart: false, abdomen: false, fh: false, fht: false, pelvic: false, speculum: false, genitalia: false, rectum: false, extremities: false, skin: false, neuro: false },
        obPE: { fh: '', fht: '', efw: '', l1: '', l2: '', l3: '', l4: '', inspection: '', speculumEx: '', internalEx: '', bimanualEx: '' },
        // Assessment
        impression: '', management: '', disposition: '', followUpDate: ''
    });

    // Steps Configuration
    const steps = [
        { id: 1, label: "Profile", icon: User },
        { id: 2, label: "History", icon: Clipboard },
        { id: 3, label: "Review of Systems", icon: AlertCircle },
        { id: 4, label: "Examination", icon: Stethoscope },
        { id: 5, label: "Plan", icon: FileText }
    ];

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const InputField = ({ label, value, onChange, placeholder = "", type = "text" }) => (
        <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-tight">{label}</label>
            <input
                type={type}
                className="border-b border-gray-200 focus:border-blue-500 outline-none p-1 text-sm bg-transparent transition-colors"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );

    const CheckboxField = ({ label, checked, onChange }) => (
        <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <span className="text-xs text-gray-600 uppercase font-medium">{label}</span>
            <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
        </label>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 bg-[#f8fafc] min-h-screen text-slate-800 font-sans">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">OB Clinical Consultation</h1>
                    <p className="text-slate-500 text-sm">MCU-F-OPD-07 Initial Comprehensive Form</p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                    <button className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition">Draft</button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-blue-700 transition flex items-center gap-2">
                        <Save size={16} /> Save Record
                    </button>
                </div>
            </div>

            {/* Stepper Navigation */}
            <div className="flex justify-between items-center mb-10 overflow-x-auto pb-4">
                {steps.map((s, i) => (
                    <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center gap-2 min-w-[80px]">
                            <div onClick={() => setCurrentStep(s.id)} className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${currentStep === s.id ? 'bg-blue-600 text-white ring-4 ring-blue-100' : currentStep > s.id ? 'bg-green-500 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                <s.icon size={18} />
                            </div>
                            <span className={`text-[10px] font-bold uppercase ${currentStep === s.id ? 'text-blue-600' : 'text-slate-400'}`}>{s.label}</span>
                        </div>
                        {i !== steps.length - 1 && <div className="flex-1 h-px bg-slate-200 mx-4 mt-[-20px]" />}
                    </React.Fragment>
                ))}
            </div>

            {/* Form Body */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 min-h-[500px]">

                {/* STEP 1: PATIENT PROFILE & GENERAL */}
                {currentStep === 1 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div>
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-6 border-l-4 border-blue-600 pl-3">I. Patient Identification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
                                <InputField label="Family Name" />
                                <InputField label="Given Name" />
                                <InputField label="Middle Name" />
                                <InputField label="Birth Date" type="date" />
                                <InputField label="Age" />
                                <InputField label="Sex" value="Female" />
                                <InputField label="Status" placeholder="Single, Married, etc." />
                                <InputField label="Tel / Mobile" />
                                <div className="md:col-span-2"><InputField label="Address" /></div>
                                <div className="md:col-span-2"><InputField label="Employer Address" /></div>
                                <InputField label="Occupation" />
                                <InputField label="Name of Spouse" />
                                <InputField label="Accompanying Person" />
                                <InputField label="Relation" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-6 border-l-4 border-blue-600 pl-3">II. Clinical Reliability</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <InputField label="% of Reliability" />
                                <InputField label="Informant" />
                                <InputField label="Personnel Responsible" />
                                <div className="md:col-span-3"><InputField label="Chief Complaint" placeholder="Reason for consult..." /></div>
                                <div className="md:col-span-3"><InputField label="History of Present Illness" placeholder="Detailed description..." /></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: FULL HISTORY */}
                {currentStep === 2 && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <h3 className="text-sm font-bold text-blue-600 uppercase mb-4">Past Medical & Surgical</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Allergy', 'Bronchial Asthma', 'Heart Disease', 'HPN', 'DM', 'TB', 'Convulsion'].map(h => (
                                        <CheckboxField key={h} label={h} />
                                    ))}
                                </div>
                                <InputField label="Other Medical History" />
                                <InputField label="Previous Hospitalizations" />
                                <InputField label="Previous Surgery" />
                                <InputField label="Immunizations" />
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-sm font-bold text-blue-600 uppercase mb-4">Family History</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {['None', 'DM', 'Heart Disease', 'HPN', 'Cancer', 'Atopy/Allergy'].map(f => (
                                        <CheckboxField key={f} label={f} />
                                    ))}
                                </div>
                                <InputField label="Others" />
                            </div>
                        </div>

                        <div className="border-t pt-10">
                            <h3 className="text-sm font-bold text-blue-600 uppercase mb-6">Personal, Social & Environmental</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                                <InputField label="Smoking History" />
                                <InputField label="Alcohol Consumption" />
                                <InputField label="Diet" />
                                <InputField label="Prohibited Drugs" />
                                <InputField label="Exercise" />
                                <InputField label="Home/Household" />
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-4">
                                    <InputField label="Water Source" />
                                    <InputField label="Toilet" />
                                    <InputField label="Garbage Disposal" />
                                </div>
                                <InputField label="Disease in Neighborhood" />
                            </div>
                        </div>

                        <div className="border-t pt-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-sm font-bold text-blue-600 uppercase mb-6">Menstrual & Sexual HX</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Menarche" />
                                    <InputField label="Interval" />
                                    <InputField label="Duration" />
                                    <InputField label="Amount" />
                                    <div className="mt-2"><CheckboxField label="Dysmenorrhea" /></div>
                                    <InputField label="Coitarche" />
                                    <InputField label="Sexual Partner" />
                                    <InputField label="Sexual Concerns" />
                                </div>
                            </div>
                            <div className="bg-blue-50/50 p-6 rounded-2xl">
                                <h3 className="text-sm font-bold text-blue-800 uppercase mb-4">Obstetrical Record (OB SCORE)</h3>
                                <div className="grid grid-cols-6 gap-2 mb-6">
                                    {['G', 'P', 'T', 'P1', 'A', 'L'].map(o => (
                                        <div key={o}>
                                            <label className="text-[9px] font-bold text-blue-400 block mb-1">{o}</label>
                                            <input type="text" className="w-full border rounded p-1 text-center font-bold text-blue-800" />
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="LNMP" type="date" />
                                    <InputField label="PMP" type="date" />
                                    <InputField label="AOG" />
                                    <InputField label="EDC" type="date" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: REVIEW OF SYSTEMS (THE GRID) */}
                {currentStep === 3 && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                            <span className="text-sm font-bold text-slate-500 uppercase">Review of Systems Checklist</span>
                            <button className="text-xs font-bold text-blue-600 hover:underline">Mark All Normal</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Category: HEENT */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-black text-slate-400 border-b pb-1 uppercase">Head & Ears</h4>
                                {['Headache', 'Dizziness', 'Migraine', 'Blurring of Vision', 'Visual Loss', 'Decreased Hearing', 'Tinnitus', 'Nose Bleeding'].map(item => (
                                    <CheckboxField key={item} label={item} />
                                ))}
                            </div>
                            {/* Category: Respiratory */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-black text-slate-400 border-b pb-1 uppercase">Respiratory</h4>
                                {['Dyspnea', 'Wheezing', 'Tachypnea', 'Cough', 'Hemoptysis'].map(item => (
                                    <CheckboxField key={item} label={item} />
                                ))}
                            </div>
                            {/* Category: Cardio/GI */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-black text-slate-400 border-b pb-1 uppercase">Cardio & Gastric</h4>
                                {['Chest Pain', 'Palpitations', 'Easily Fatigue', 'Orthopnea', 'PUD', 'Hematemesis', 'Constipation', 'Diarrhea'].map(item => (
                                    <CheckboxField key={item} label={item} />
                                ))}
                            </div>
                            {/* Category: GI/Others */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-black text-slate-400 border-b pb-1 uppercase">GI & Musculoskeletal</h4>
                                {['Hematochezia', 'Dyspepsia', 'Abdominal Pain', 'Melena', 'Neck Pain', 'Joint Pain', 'Back Pain', 'Muscle Pain'].map(item => (
                                    <CheckboxField key={item} label={item} />
                                ))}
                            </div>
                            {/* Category: Neuro/Psych */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-black text-slate-400 border-b pb-1 uppercase">Neuro & Psych</h4>
                                {['Paresthesia', 'Weakness', 'Syncope', 'Convulsion', 'Depression', 'Hallucination'].map(item => (
                                    <CheckboxField key={item} label={item} />
                                ))}
                            </div>
                            {/* Category: Gen/General */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-black text-slate-400 border-b pb-1 uppercase">General</h4>
                                {['Fever', 'Chills', 'Jaundice', 'Malaise'].map(item => (
                                    <CheckboxField key={item} label={item} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: EXAMINATION & VITALS */}
                {currentStep === 4 && (
                    <div className="space-y-12 animate-in fade-in duration-500">
                        <div className="bg-blue-50 text-black rounded-2xl p-8 shadow-xl relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-8 border-b border-slate-700 pb-4">
                                <Activity size={20} className="text-blue-400" />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Vital Signs & Anthropometrics</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
                                {['PR', 'RR', 'BP', 'Temp', 'Weight', 'Height', 'BMI', 'Pain Scale'].map(v => (
                                    <div key={v}>
                                        <label className="text-[9px] font-black text-slate-500 uppercase block mb-2">{v}</label>
                                        <input type="text" className="w-full bg-blue-100 border-none rounded-lg p-2 font-bold text-blue-400 outline-none focus:ring-1 focus:ring-blue-500" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-1 space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">General Survey (Check if Normal)</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {['HEENT', 'Breast', 'Chest & Lungs', 'Heart', 'Abdomen', 'FH', 'FHT', 'Pelvic Exam', 'Speculum Exam', 'Genitalia', 'Rectum', 'Extremities', 'Skin', 'Neurology Exam'].map(pe => (
                                        <CheckboxField key={pe} label={pe} />
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-10">
                                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                    <h3 className="text-xs font-bold text-blue-800 uppercase mb-6 tracking-widest flex items-center gap-2">
                                        <Heart size={14} /> OB Specific Examination
                                    </h3>
                                    <div className="grid grid-cols-3 gap-6 mb-8">
                                        <InputField label="FH (Fundal Height)" />
                                        <InputField label="FHT (Fetal Heart Tone)" />
                                        <InputField label="EFW (Est. Fetal Weight)" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-blue-400 uppercase">Leopold's Maneuver</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['L1', 'L2', 'L3', 'L4'].map(l => (
                                                <div key={l} className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-blue-700">{l}:</span>
                                                    <input className="flex-1 bg-white border border-blue-100 rounded px-2 py-1 text-sm outline-none" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pelvic Examination Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField label="Inspection" />
                                        <InputField label="Speculum Examination" />
                                        <InputField label="Internal or Rectal Exam" />
                                        <InputField label="Bimanual Examination" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 5: ASSESSMENT & PLAN */}
                {currentStep === 5 && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-blue-600 uppercase">Clinical Impression</label>
                                <textarea rows="6" className="w-full border rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none resize-none" placeholder="Enter diagnosis..." />
                            </div>
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-blue-600 uppercase">Plan of Management</label>
                                <textarea rows="6" className="w-full border rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none resize-none" placeholder="Enter treatment plan..." />
                            </div>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                            <h3 className="text-xs font-bold text-slate-800 uppercase mb-6 tracking-widest">Disposition & Follow-up</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                <div className="space-y-4">
                                    <CheckboxField label="Admitted" />
                                    <CheckboxField label="Discharged with prescription & instructions" />
                                    <CheckboxField label="Home against medical advice" />
                                </div>
                                <InputField label="Date of Follow-up" type="date" />
                            </div>
                        </div>

                        <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-12 text-center border-t border-slate-100">
                            <div className="space-y-10">
                                <div className="border-b border-slate-300 pb-2 flex gap-4 justify-center">
                                    <CheckboxField label="CC" /> <CheckboxField label="PGI" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">History & PE Done By (Digital Signature)</p>
                            </div>
                            <div className="space-y-4">
                                <div className="border-b border-slate-300 pb-2">
                                    <span className="text-sm font-bold text-slate-800">DR. FILIPINO, MD</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resident in Charge / Consultant on Duty</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="mt-8 flex justify-between items-center">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition ${currentStep === 1 ? 'opacity-0' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}
                >
                    <ChevronLeft size={18} /> BACK
                </button>

                <div className="hidden md:flex gap-2">
                    {steps.map(s => (
                        <div key={s.id} className={`h-1.5 w-6 rounded-full transition-all ${currentStep === s.id ? 'bg-blue-600 w-12' : 'bg-slate-200'}`} />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition ${currentStep === 5 ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {currentStep === 5 ? 'COMPLETE RECORD' : 'NEXT STEP'} <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default FullOBConsult;