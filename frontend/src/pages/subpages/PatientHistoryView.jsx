import React, {useState} from 'react';
import {Calendar, PlusCircle, FileText} from 'lucide-react';

export default function PatientHistoryView({history, onAddHistory}) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEntry, setNewEntry] = useState({
        visitDate: new Date().toISOString().split('T')[0],
        diagnosis: '',
        treatmentNotes: '',
        prescriptions: '',
        attendingPhysician: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddHistory(newEntry);
        setShowAddForm(false);
        setNewEntry({
            visitDate: new Date().toISOString().split('T')[0],
            diagnosis: '',
            treatmentNotes: '',
            prescriptions: '',
            attendingPhysician: ''
        });
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500"/> Medical History & Consultations
                </h3>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1"
                >
                    <PlusCircle className="w-4 h-4"/> {showAddForm ? 'Cancel' : 'Add Consultation'}
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6 border space-y-4 text-sm">
                    <h4 className="font-semibold text-gray-700">New Consultation Record</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-gray-500 mb-1">Visit Date</label>
                            <input
                                type="date"
                                value={newEntry.visitDate}
                                onChange={(e) => setNewEntry({...newEntry, visitDate: e.target.value})}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1">Attending Physician</label>
                            <input
                                type="text"
                                value={newEntry.attendingPhysician}
                                onChange={(e) => setNewEntry({...newEntry, attendingPhysician: e.target.value})}
                                className="w-full border rounded p-2"
                                placeholder="Dr. Name"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1">Diagnosis</label>
                            <input
                                type="text"
                                value={newEntry.diagnosis}
                                onChange={(e) => setNewEntry({...newEntry, diagnosis: e.target.value})}
                                className="w-full border rounded p-2"
                                placeholder="Primary diagnosis"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-500 mb-1">Treatment Notes</label>
                            <textarea
                                rows="2"
                                value={newEntry.treatmentNotes}
                                onChange={(e) => setNewEntry({...newEntry, treatmentNotes: e.target.value})}
                                className="w-full border rounded p-2 resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1">Prescriptions</label>
                            <textarea
                                rows="2"
                                value={newEntry.prescriptions}
                                onChange={(e) => setNewEntry({...newEntry, prescriptions: e.target.value})}
                                className="w-full border rounded p-2 resize-none"
                            />
                        </div>
                    </div>
                    <button type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded font-medium text-xs hover:bg-blue-700">
                        Save Consultation Entry
                    </button>
                </form>
            )}

            {history.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">No recorded consultations yet.</p>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div key={item.id}
                             className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm space-y-2 text-sm">
                            <div className="flex justify-between items-center text-xs text-gray-500 border-b pb-2">
                <span className="font-semibold text-blue-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5"/> {item.visitDate}
                </span>
                                <span>Physician: {item.attendingPhysician || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Diagnosis: </span>
                                <span className="text-gray-800">{item.diagnosis}</span>
                            </div>
                            {item.treatmentNotes && (
                                <div>
                                    <span className="font-semibold text-gray-700">Treatment: </span>
                                    <span className="text-gray-800">{item.treatmentNotes}</span>
                                </div>
                            )}
                            {item.prescriptions && (
                                <div>
                                    <span className="font-semibold text-gray-700">Prescriptions: </span>
                                    <span className="text-emerald-700 font-medium">{item.prescriptions}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}