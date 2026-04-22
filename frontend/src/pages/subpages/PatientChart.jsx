import React, { useState } from 'react';
import { User, Clipboard, Calendar, ChevronRight } from 'lucide-react';
import PatientInfoFields from '../../components/patients/PatientInfoFields';
import MedicineConsultDetails from './MedicineConsultDetails';
import OBConsultDetails from './OBConsultDetails';
import ENTConsultDetails from './ENTConsultDetails';
import OptaConsultDetails from './OptaConsultDetails';
import PediaConsultDetails from './PediaConsultDetails';
import FollowupConsultDetails from './FollowupConsultDetails';
import ReferralConsultDetails from './ReferralConsultDetails';

const PatientChart = () => {
    const [selectedVisit, setSelectedVisit] = useState(null);

    // Full sample set restored to include all departments
    const [consultations] = useState([
        { id: 101, date: '2026-04-12', type: 'Referral', complaint: 'Inter-departmental Referral', doctor: 'Dr. De Castro' },
        { id: 702, date: '2026-04-05', type: 'Medicine', complaint: 'Acute Gastritis', doctor: 'Dr. Tanchoco' },
        { id: 901, date: '2026-03-28', type: 'Opta', complaint: 'Blurring of Vision (OD)', doctor: 'Dr. Reyes' },
        { id: 882, date: '2026-03-22', type: 'Follow-up', complaint: 'Post-op OB Check', doctor: 'Dr. Filipino', pr: '72', rr: '18', bp: '110/70', temp: '36.5', weight: '58kg', height: '162cm', bmi: '22.1' },
        { id: 105, date: '2026-03-15', type: 'OB-GYN', complaint: 'Routine Prenatal (32 weeks)', doctor: 'Dr. Filipino' },
        { id: 302, date: '2026-03-10', type: 'Pedia', complaint: 'Routine Growth Check-up', doctor: 'Dr. Santos' },
        { id: 405, date: '2026-02-17', type: 'ENT', complaint: 'Epistaxis & Sore Throat', doctor: 'Dr. Ponsaran' },
    ]);

    const [patientData, setPatientData] = useState({
        id: '1021',
        familyName: 'Clara',
        givenName: 'Maria',
        birthDate: '1992-05-12',
        age: '33',
        sex: 'Female',
        imageUrl: null,
        insurance: 'PhilHealth',
        hmo: 'Maxicare',
        philhealth: '12-345678901-2'
    });

    const getTagStyles = (type) => {
        switch(type) {
            case 'OB-GYN': return 'bg-pink-100 text-pink-700 border-pink-200';
            case 'ENT': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Opta': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Pedia': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
            case 'Referral': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Follow-up': return 'bg-slate-800 text-white border-slate-900';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8 bg-[#f8fafc] min-h-screen text-left">
            {/* 1. TOP PANE: PATIENT PROFILE */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-6 border-t-4 border-t-blue-600">
                <h3 className="text-xs font-black text-blue-600 uppercase mb-6 flex items-center gap-2 tracking-[0.2em]">
                    <User size={14}/> Patient Profile
                </h3>
                <PatientInfoFields formData={patientData} setFormData={setPatientData} />
            </div>

            {/* 2. MIDDLE PANE: VISIT HISTORY */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Clipboard size={14}/> Clinical Visit History
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 italic">
                        {consultations.length} total records
                    </span>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {consultations.map((c) => (
                        <div
                            key={c.id}
                            onClick={() => setSelectedVisit(c)}
                            className={`p-4 px-6 cursor-pointer flex items-center justify-between hover:bg-blue-50/50 transition-all ${selectedVisit?.id === c.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                        >
                            <div className="flex gap-12 items-center">
                                <span className="text-sm font-black text-slate-700 w-24">{c.date}</span>
                                <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${getTagStyles(c.type)}`}>
                                    {c.type}
                                </span>
                                <span className="text-sm text-slate-600 font-bold">{c.complaint}</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <span className="text-[10px] font-bold uppercase tracking-tighter">{c.doctor}</span>
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. BOTTOM PANE: DYNAMIC DETAIL VIEW */}
            <div className="mt-8">
                {!selectedVisit ? (
                    <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white shadow-inner">
                        <Calendar className="mx-auto text-slate-200 mb-4" size={48} strokeWidth={1} />
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                            Select a record from history to view clinical details
                        </p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {selectedVisit.type === 'Medicine' && <MedicineConsultDetails visitData={selectedVisit} />}
                        {selectedVisit.type === 'OB-GYN' && <OBConsultDetails visitData={selectedVisit} />}
                        {selectedVisit.type === 'ENT' && <ENTConsultDetails visitData={selectedVisit} />}
                        {selectedVisit.type === 'Opta' && <OptaConsultDetails visitData={selectedVisit} />}
                        {selectedVisit.type === 'Pedia' && <PediaConsultDetails visitData={selectedVisit} />}
                        {selectedVisit.type === 'Follow-up' && <FollowupConsultDetails visitData={selectedVisit} />}
                        {selectedVisit.type === 'Referral' && <ReferralConsultDetails visitData={selectedVisit} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientChart;