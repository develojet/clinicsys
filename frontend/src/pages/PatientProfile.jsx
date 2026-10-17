import React, {useState, useEffect} from 'react';
import {getPatientById, updatePatient} from '../services/patientService';
import {User, Phone, MapPin, Briefcase, Shield, FileText, Calendar} from 'lucide-react';

export default function PatientProfile({patientId = 1}) {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchPatientData();
    }, [patientId]);

    const fetchPatientData = async () => {
        try {
            setLoading(true);
            const response = await getPatientById(patientId);
            setPatient(response.data);
        } catch (error) {
            console.error("Error fetching patient profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setPatient({...patient, [name]: value});
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await updatePatient(patientId, patient);
            setIsEditing(false);
            fetchPatientData();
        } catch (error) {
            console.error("Error updating patient profile:", error);
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-500">Loading patient profile...</div>;
    if (!patient) return <div className="p-6 text-center text-red-500">Patient not found.</div>;

    return (
        <div
            className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mt-6 border border-gray-100">
            {/* Header / ID Badge */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div className="flex items-center space-x-4">
                    <img
                        src={patient.photoUrl || "https://via.placeholder.com/150"}
                        alt="Patient"
                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                    />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {patient.familyName}, {patient.givenName} {patient.middleName}
                        </h2>
                        <span
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold mt-1">
              Patient ID: {patient.patientCode}
            </span>
                    </div>
                </div>
                <button
                    onClick={() => {
                        if (isEditing) handleSave();
                        setIsEditing(!isEditing);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isEditing
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>

            {/* Profile Form / Details Grid */}
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

                {/* Personal Information */}
                <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                        <User className="w-4 h-4 text-blue-500"/> Personal Information
                    </h3>

                    <div>
                        <label className="block text-gray-500 font-medium mb-1">Family Name</label>
                        <input
                            type="text"
                            name="familyName"
                            disabled={!isEditing}
                            value={patient.familyName || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded-md p-2 disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-500 font-medium mb-1">Given Name</label>
                        <input
                            type="text"
                            name="givenName"
                            disabled={!isEditing}
                            value={patient.givenName || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded-md p-2 disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-500 font-medium mb-1">Middle Name</label>
                        <input
                            type="text"
                            name="middleName"
                            disabled={!isEditing}
                            value={patient.middleName || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded-md p-2 disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-gray-500 font-medium mb-1">Birth Date</label>
                            <input
                                type="date"
                                name="birthDate"
                                disabled={!isEditing}
                                value={patient.birthDate || ''}
                                onChange={handleInputChange}
                                className="w-full border rounded-md p-2 disabled:bg-gray-50 disabled:text-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-500 font-medium mb-1">Age / Sex</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    name="age"
                                    disabled={!isEditing}
                                    value={patient.age || ''}
                                    onChange={handleInputChange}
                                    className="w-1/2 border rounded-md p-2 disabled:bg-gray-50 disabled:text-gray-600"
                                />
                                <input
                                    type="text"
                                    name="sex"
                                    disabled={!isEditing}
                                    value={patient.sex || ''}
                                    onChange={handleInputChange}
                                    className="w-1/2 border rounded-md p-2 disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-500 font-medium mb-1">Civil Status</label>
                        <input
                            type="text"
                            name="status"
                            disabled={!isEditing}
                            value={patient.status || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded-md p-2 disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>
                </div>

                {/* Contact, Work & Insurance */}
                <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                        <Phone className="w-4 h-4 text-blue-500"/> Contact & Affiliations
                    </h3>

                    <div>
                        <label className="block text-gray-500 font-medium mb-1">Mobile Number</label>
                        <input
                            type="text"
                            name="mobileNumber"
                            disabled={!isEditing}
                            value={patient.mobileNumber || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded-md p-2 disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-500 font-medium mb-1">Home Address</label>
                        <textarea
                            name="address"
                            rows="2"
                            disabled={!isEditing}
                            value={patient.address || ''}
                            onChange={handleInputChange}
                            className="w-full border rounded-md p-2 disabled:bg-gray-50 disabled:text-gray-600 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-gray-500 font-medium mb-1">Occupation</label>
                            <input
                                type="text"
                                name="occupation"
                                disabled={!isEditing}
                                value={patient.occupation || ''}
                                onChange={handleInputChange}
                                className="w-full border rounded-md p-2 disabled:bg-gray-50 disabled:text-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-500 font-medium mb-1">Spouse Name</label>
                            <input
                                type="text"
                                name="spouseName"
                                disabled={!isEditing}
                                value={patient.spouseName || ''}
                                onChange={handleInputChange}
                                className="w-full border rounded-md p-2 disabled:bg-gray-50 disabled:text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-gray-500 font-medium mb-1">Insurance / HMO</label>
                            <input
                                type="text"
                                name="hmo"
                                disabled={!isEditing}
                                value={patient.hmo || ''}
                                onChange={handleInputChange}
                                className="w-full border rounded-md p-2 disabled:bg-gray-50 disabled:text-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-500 font-medium mb-1">PhilHealth No.</label>
                            <input
                                type="text"
                                name="philhealthNo"
                                disabled={!isEditing}
                                value={patient.philhealthNo || ''}
                                onChange={handleInputChange}
                                className="w-full border rounded-md p-2 disabled:bg-gray-50 disabled:text-gray-600"
                            />
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}