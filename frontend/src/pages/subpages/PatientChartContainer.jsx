import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { getPatientById, updatePatient, getMedicalHistory, addMedicalHistory, deletePatient } from '../../services/patientService';
import PatientProfileView from './PatientProfileView';
import PatientHistoryView from './PatientHistoryView';

export default function PatientChartContainer({ patientId, onBack }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    const resolvedPatientId = patientId ?? (searchParams.get('id') ? Number(searchParams.get('id')) : null);

    useEffect(() => {
        if (resolvedPatientId) {
            fetchAllData();
        } else {
            setLoading(false);
            setPatient(null);
        }
    }, [resolvedPatientId]);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [patientRes, historyRes] = await Promise.all([
                getPatientById(resolvedPatientId),
                getMedicalHistory(resolvedPatientId)
            ]);
            setPatient(patientRes.data);
            setHistory(historyRes.data || []);
        } catch (error) {
            console.error('Error fetching patient chart container data:', error);
            setPatient(null);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePatient = async (updatedData) => {
        const response = await updatePatient(resolvedPatientId, updatedData);
        setPatient(response.data);
    };

    const handleAddHistory = async (newEntry) => {
        try {
            await addMedicalHistory(resolvedPatientId, newEntry);
            fetchAllData();
        } catch (error) {
            console.error('Error adding consultation history:', error);
        }
    };

    const handleDeletePatient = async () => {
        if (!window.confirm(`Delete the record for ${patient.givenName} ${patient.familyName}? This cannot be undone.`)) {
            return;
        }

        setDeleting(true);
        setDeleteError('');
        try {
            await deletePatient(resolvedPatientId);
            navigate('/patients');
        } catch (error) {
            console.error('Error deleting patient:', error);
            setDeleteError(error.response?.data?.message || 'Could not delete patient. The record may be linked to existing appointments.');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-500">Loading patient chart...</div>;
    if (!patient) return <div className="p-6 text-center text-red-500">Patient not found.</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {(onBack || resolvedPatientId) && (
                <button
                    onClick={() => (onBack ? onBack() : navigate('/patients'))}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-medium"
                >
                    &larr; Back to Patient List
                </button>
            )}

            <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={patient.photoUrl || 'https://via.placeholder.com/100'}
                            alt="Patient"
                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                        />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {[patient.familyName, patient.givenName, patient.middleName].filter(Boolean).join(', ') || 'Unknown Patient'}
                            </h2>
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold mt-1">
                                {patient.patientCode || `PX-${patient.id}`}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleDeletePatient}
                        disabled={deleting}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                        <Trash2 size={16} />
                        {deleting ? 'Deleting...' : 'Delete Patient'}
                    </button>
                </div>
                {deleteError && <p role="alert" className="mt-4 text-sm text-red-600">{deleteError}</p>}
            </div>

            <PatientProfileView patient={patient} onUpdatePatient={handleUpdatePatient} />
            <PatientHistoryView history={history} onAddHistory={handleAddHistory} />
        </div>
    );
}