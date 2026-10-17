import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Calendar, ChevronRight, X } from 'lucide-react';
import { createPatient, getPatients } from '../services/patientService';

const Patients = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewPatient, setShowNewPatient] = useState(false);
    const [savingPatient, setSavingPatient] = useState(false);
    const [formError, setFormError] = useState('');
    const [newPatient, setNewPatient] = useState({
        givenName: '',
        middleName: '',
        familyName: '',
        birthDate: '',
        sex: '',
        status: '',
        mobileNumber: '',
        address: '',
        occupation: '',
        insurance: '',
        hmo: '',
        philhealthNo: ''
    });

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await getPatients();
            setPatients(response.data || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleCreatePatient = async (event) => {
        event.preventDefault();
        setSavingPatient(true);
        setFormError('');
        try {
            await createPatient(newPatient);
            setShowNewPatient(false);
            setNewPatient({
                givenName: '',
                middleName: '',
                familyName: '',
                birthDate: '',
                sex: '',
                status: '',
                mobileNumber: '',
                address: '',
                occupation: '',
                insurance: '',
                hmo: '',
                philhealthNo: ''
            });
            await fetchPatients();
        } catch (error) {
            console.error('Error creating patient:', error);
            setFormError(error.response?.data?.message || 'Could not create patient. Please check the details and try again.');
        } finally {
            setSavingPatient(false);
        }
    };

    const filteredPatients = useMemo(() => {
        return patients.filter((patient) => {
            const fullName = [patient.familyName, patient.givenName, patient.middleName].filter(Boolean).join(' ');
            const search = searchTerm.toLowerCase();
            return (
                fullName.toLowerCase().includes(search) ||
                (patient.patientCode || '').toLowerCase().includes(search) ||
                (patient.mobileNumber || '').toLowerCase().includes(search)
            );
        });
    }, [patients, searchTerm]);

    const formatPatientName = (patient) => {
        const parts = [patient.familyName, patient.givenName, patient.middleName].filter(Boolean);
        return parts.length ? parts.join(' ') : 'Unknown Patient';
    };

    return (
        <div className="w-full animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div className="text-left">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Patient Directory</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage hospital-wide clinical records</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 text-left">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all text-slate-800"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setFormError('');
                            setShowNewPatient(true);
                        }}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-slate-200 uppercase tracking-widest"
                    >
                        <UserPlus size={16} /> New Patient
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 text-center text-slate-500">Loading patient directory...</div>
                ) : (
                    <>
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient ID</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Birth Date</th>
                                <th className="px-8 py-5 text-right"></th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                            {filteredPatients.map((patient) => (
                                <tr
                                    key={patient.id}
                                    onClick={() => navigate(`/patients/chart?id=${patient.id}`)}
                                    className="group hover:bg-blue-50/30 cursor-pointer transition-colors"
                                >
                                    <td className="px-8 py-4">
                                        <span className="text-xs font-mono font-bold text-slate-400">{patient.patientCode || `PX-${patient.id}`}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-[11px] font-black border border-blue-100">
                                                {formatPatientName(patient).charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{formatPatientName(patient)}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{patient.sex || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-slate-600 font-medium tracking-tight">
                                            {patient.status || 'No status'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-slate-600 font-medium tracking-tight">
                                            {patient.mobileNumber || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Calendar size={12} className="opacity-40" />
                                            <span className="text-xs font-bold">{patient.birthDate || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <span className="text-[10px] font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest translate-x-2 group-hover:translate-x-0">
                                                Open Chart
                                            </span>
                                            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {filteredPatients.length === 0 && (
                            <div className="py-24 text-center">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={24} className="text-slate-300" />
                                </div>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">No patient records found</p>
                                <p className="text-slate-400 text-xs mt-1">Try searching with a different name or ID</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {!loading && (
                <div className="mt-6 flex justify-between items-center px-4">
                    <div className="flex items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Displaying {filteredPatients.length} of {patients.length} Records
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-900 text-white shadow-md shadow-slate-200">1</button>
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-500 hover:bg-slate-50">2</button>
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-500 hover:bg-slate-50">3</button>
                    </div>
                </div>
            )}

            {showNewPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="new-patient-title">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h2 id="new-patient-title" className="text-xl font-bold text-slate-900">Register New Patient</h2>
                                <p className="mt-1 text-sm text-slate-500">Patient ID will be assigned automatically.</p>
                            </div>
                            <button type="button" onClick={() => setShowNewPatient(false)} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePatient} className="space-y-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {[
                                    ['givenName', 'Given Name', true],
                                    ['middleName', 'Middle Name', false],
                                    ['familyName', 'Family Name', true],
                                    ['birthDate', 'Birth Date', false, 'date'],
                                    ['sex', 'Sex', false],
                                    ['status', 'Civil Status / Condition', false],
                                    ['mobileNumber', 'Mobile Number', false],
                                    ['occupation', 'Occupation', false],
                                    ['philhealthNo', 'PhilHealth No.', false],
                                    ['insurance', 'Insurance', false],
                                    ['hmo', 'HMO', false]
                                ].map(([name, label, required, type = 'text']) => (
                                    <label key={name} className="block text-sm font-medium text-slate-600">
                                        {label}
                                        <input
                                            name={name}
                                            type={type}
                                            required={required}
                                            value={newPatient[name]}
                                            onChange={(event) => setNewPatient({ ...newPatient, [name]: event.target.value })}
                                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </label>
                                ))}
                                <label className="block text-sm font-medium text-slate-600 sm:col-span-3">
                                    Home Address
                                    <textarea
                                        name="address"
                                        rows="2"
                                        value={newPatient.address}
                                        onChange={(event) => setNewPatient({ ...newPatient, address: event.target.value })}
                                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>
                            </div>

                            {formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <button type="button" onClick={() => setShowNewPatient(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={savingPatient} className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60">
                                    {savingPatient ? 'Saving...' : 'Create Patient'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patients;