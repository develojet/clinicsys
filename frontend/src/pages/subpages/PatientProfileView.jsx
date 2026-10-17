import React, {useState, useEffect} from 'react';
import {User} from 'lucide-react';

export default function PatientProfileView({patient, onUpdatePatient}) {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(patient || {});

    useEffect(() => {
        setFormData(patient || {});
    }, [patient]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await onUpdatePatient({
                ...formData,
                firstName: formData.givenName,
                lastName: formData.familyName,
                age: formData.age === '' ? null : Number(formData.age)
            });
            setIsEditing(false);
        } catch (saveError) {
            setError(saveError.response?.data?.message || 'Could not save patient details. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500"/> Patient Profile Information
                </h3>
                {!isEditing && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {[
                    ['familyName', 'Family Name', 'text'],
                    ['givenName', 'Given Name', 'text'],
                    ['middleName', 'Middle Name', 'text'],
                    ['birthDate', 'Birth Date', 'date'],
                    ['age', 'Age', 'number'],
                    ['sex', 'Sex', 'text'],
                    ['status', 'Civil Status / Condition', 'text'],
                    ['mobileNumber', 'Mobile Number', 'tel'],
                    ['occupation', 'Occupation', 'text'],
                    ['spouseName', 'Spouse Name', 'text'],
                    ['insurance', 'Insurance', 'text'],
                    ['hmo', 'HMO', 'text'],
                    ['philhealthNo', 'PhilHealth No.', 'text']
                ].map(([name, label, type]) => (
                    <label key={name} className="block font-medium text-gray-500">
                        {label}
                        <input
                            type={type}
                            name={name}
                            disabled={!isEditing}
                            value={formData[name] ?? ''}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded p-2 disabled:bg-gray-50 disabled:text-gray-600"
                        />
                    </label>
                ))}
                <label className="block font-medium text-gray-500 md:col-span-3">
                    Home Address
                    <textarea
                        name="address"
                        rows="2"
                        disabled={!isEditing}
                        value={formData.address || ''}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded p-2 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                </label>
                <label className="block font-medium text-gray-500 md:col-span-3">
                    Employer Address
                    <textarea
                        name="employerAddress"
                        rows="2"
                        disabled={!isEditing}
                        value={formData.employerAddress || ''}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded p-2 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                </label>
                {error && <p role="alert" className="text-red-600 md:col-span-3">{error}</p>}
                {isEditing && (
                    <div className="flex justify-end gap-2 md:col-span-3">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData(patient || {});
                                setError('');
                                setIsEditing(false);
                            }}
                            disabled={saving}
                            className="rounded-lg border border-gray-200 px-4 py-2 font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-60"
                        >
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}