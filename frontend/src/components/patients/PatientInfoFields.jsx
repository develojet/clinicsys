import React from 'react';
import { User, Camera } from 'lucide-react';

const InputField = ({ label, value, onChange, placeholder = "", type = "text", readOnly = false }) => (
    <div className="flex flex-col">
        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-tight">{label}</label>
        <input
            type={type}
            className={`border-b border-gray-200 focus:border-blue-500 outline-none p-1 text-sm bg-transparent transition-colors text-black ${readOnly ? 'cursor-default opacity-70' : ''}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
        />
    </div>
);

const PatientInfoFields = ({ formData, setFormData }) => {
    const handleChange = (field, val) => {
        setFormData(prev => ({ ...prev, [field]: val }));
    };

    return (
        <div className="flex flex-col md:flex-row gap-10 items-start">

            {/* --- LEFT: PATIENT IMAGE SECTION --- */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                    <div className="w-40 h-40 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-300">
                        {formData.imageUrl ? (
                            <img
                                src={formData.imageUrl}
                                alt="Patient"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-slate-300 flex flex-col items-center gap-2">
                                <User size={48} strokeWidth={1.5} />
                                <span className="text-[9px] font-black uppercase">No Photo</span>
                            </div>
                        )}

                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <div className="bg-white p-2 rounded-full shadow-lg">
                                <Camera size={18} className="text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient ID</p>
                    <p className="text-sm font-mono font-bold text-slate-700">#PX-{formData.id || '0000'}</p>
                </div>
            </div>

            {/* --- RIGHT: FORM FIELDS SECTION --- */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
                <InputField label="Family Name" value={formData.familyName} onChange={e => handleChange('familyName', e.target.value)} />
                <InputField label="Given Name" value={formData.givenName} onChange={e => handleChange('givenName', e.target.value)} />
                <InputField label="Middle Name" value={formData.middleName} onChange={e => handleChange('middleName', e.target.value)} />
                <InputField label="Birth Date" type="date" value={formData.birthDate} onChange={e => handleChange('birthDate', e.target.value)} />

                <InputField label="Age" value={formData.age} onChange={e => handleChange('age', e.target.value)} />
                <InputField label="Sex" value={formData.sex} readOnly />
                <InputField label="Status" value={formData.status} onChange={e => handleChange('status', e.target.value)} />
                <InputField label="Tel / Mobile" value={formData.telNo} onChange={e => handleChange('telNo', e.target.value)} />

                <div className="md:col-span-2">
                    <InputField label="Address" value={formData.address} onChange={e => handleChange('address', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                    <InputField label="Employer Address" value={formData.employerAddress} onChange={e => handleChange('employerAddress', e.target.value)} />
                </div>

                <InputField label="Occupation" value={formData.occupation} onChange={e => handleChange('occupation', e.target.value)} />
                <InputField label="Name of Spouse" value={formData.nameOfSpouse} onChange={e => handleChange('nameOfSpouse', e.target.value)} />
                <InputField label="Insurance" value={formData.insurance} onChange={e => handleChange('insurance', e.target.value)} />
                <InputField label="HMO" value={formData.hmo} onChange={e => handleChange('hmo', e.target.value)} />

                <div className="md:col-span-2">
                    <InputField label="PhilHealth No." value={formData.philhealth} onChange={e => handleChange('philhealth', e.target.value)} />
                </div>
            </div>
        </div>
    );
};

export default PatientInfoFields;