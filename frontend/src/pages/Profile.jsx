import React, {useState, useRef, useEffect} from 'react';
import {
    User,
    Camera,
    FileSignature,
    Trash2,
    Upload,
    Check,
    X,
    Save,
    Loader2,
    Mail,
    Phone,
    Building,
    ShieldCheck
} from 'lucide-react';
import {ImageCropModal} from './ImageCropModal';

export default function Profile() {
    // User Profile Form State
    const [formData, setFormData] = useState({
        firstName: 'Jethro',
        lastName: 'Orencia',
        email: 'jethro@example.com',
        phone: '+63 917 123 4567',
        department: 'Software Engineering',
        role: 'Senior Software Engineer',
        avatarUrl: '',
        signatureUrl: ''
    });

    // Component UI States
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUploadingSignature, setIsUploadingSignature] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Refs for Hidden File Inputs
    const avatarInputRef = useRef(null);
    const signatureInputRef = useRef(null);

    // Crop Modal State
    const [cropModal, setCropModal] = useState({
        isOpen: false,
        imageSrc: null,
        target: null, // 'avatar' | 'signature'
        aspect: 1,    // 1:1 for avatar, undefined for signature
        title: ''
    });

    // Auto-clear success banner after 4 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Handle Form Text Inputs
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    // Step 1: Intercept file selection and open crop modal
    const handleFileSelected = (e, target) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setCropModal({
                isOpen: true,
                imageSrc: reader.result,
                target: target,
                aspect: target === 'avatar' ? 1 : undefined, // 1:1 square/circle for avatar, freeform for signature
                title: target === 'avatar' ? 'Crop Profile Picture' : 'Crop Digital Signature'
            });
        };
        reader.readAsDataURL(file);

        // Reset file input value so the same file can be selected again if needed
        e.target.value = '';
    };

    // Step 2: Receive cropped File object from ImageCropModal and dispatch to upload handlers
    const handleCropComplete = async (croppedFile) => {
        const target = cropModal.target;
        setCropModal((prev) => ({...prev, isOpen: false}));

        if (target === 'avatar') {
            await handleAvatarUpload(croppedFile);
        } else if (target === 'signature') {
            await handleSignatureUpload(croppedFile);
        }
    };

    // Upload Cropped Avatar to Spring Boot Backend
    const handleAvatarUpload = async (file) => {
        setIsUploadingAvatar(true);
        const data = new FormData();
        data.append('file', file);

        try {
            // Replace with your actual Spring Boot endpoint
            const response = await fetch('/api/v1/users/profile/avatar', {
                method: 'POST',
                body: data,
                headers: {
                    // Include Authorization headers if required (e.g., Bearer Token)
                    // 'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to upload avatar');

            const result = await response.json();
            setFormData((prev) => ({...prev, avatarUrl: result.url || URL.createObjectURL(file)}));
            setSuccessMessage('Profile photo updated successfully!');
        } catch (error) {
            console.error('Avatar upload error:', error);
            // Fallback preview for demonstration if API fails or is unmocked
            setFormData((prev) => ({...prev, avatarUrl: URL.createObjectURL(file)}));
            setSuccessMessage('Avatar uploaded (local preview mode).');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    // Upload Cropped Digital Signature to Spring Boot Backend
    const handleSignatureUpload = async (file) => {
        setIsUploadingSignature(true);
        const data = new FormData();
        data.append('file', file);

        try {
            // Replace with your actual Spring Boot endpoint
            const response = await fetch('/api/v1/users/profile/signature', {
                method: 'POST',
                body: data
            });

            if (!response.ok) throw new Error('Failed to upload signature');

            const result = await response.json();
            setFormData((prev) => ({...prev, signatureUrl: result.url || URL.createObjectURL(file)}));
            setSuccessMessage('Digital signature uploaded successfully!');
        } catch (error) {
            console.error('Signature upload error:', error);
            // Fallback preview for demonstration if API fails or is unmocked
            setFormData((prev) => ({...prev, signatureUrl: URL.createObjectURL(file)}));
            setSuccessMessage('Signature uploaded (local preview mode).');
        } finally {
            setIsUploadingSignature(false);
        }
    };

    // Delete Digital Signature
    const handleDeleteSignature = async () => {
        if (!window.confirm('Are you sure you want to remove your digital signature?')) return;

        try {
            await fetch('/api/v1/users/profile/signature', {method: 'DELETE'});
            setFormData((prev) => ({...prev, signatureUrl: ''}));
            setSuccessMessage('Digital signature removed.');
        } catch (error) {
            console.error('Failed to delete signature:', error);
            setFormData((prev) => ({...prev, signatureUrl: ''}));
        }
    };

    // Submit Full Form Data
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch('/api/v1/users/profile', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save profile');

            setSuccessMessage('Profile details saved successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            setSuccessMessage('Profile updated locally.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header Title */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                <p className="text-sm text-slate-500 font-medium">Manage your profile details, avatar, and digital
                    signature.</p>
            </div>

            {/* Success Banner */}
            {successMessage && (
                <div
                    className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-800 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-emerald-600"/>
                        <span>{successMessage}</span>
                    </div>
                    <button onClick={() => setSuccessMessage('')} className="text-emerald-500 hover:text-emerald-700">
                        <X className="w-4 h-4"/>
                    </button>
                </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-8">
                {/* 1. Profile Picture & Hero Card */}
                <div
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                        <div
                            className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md flex items-center justify-center">
                            {formData.avatarUrl ? (
                                <img
                                    src={formData.avatarUrl}
                                    alt="User Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-12 h-12 text-slate-400"/>
                            )}
                            {isUploadingAvatar && (
                                <div
                                    className="absolute inset-0 bg-slate-900/50 flex items-center justify-center backdrop-blur-xs">
                                    <Loader2 className="w-6 h-6 text-white animate-spin"/>
                                </div>
                            )}
                        </div>

                        {/* Trigger Hidden Avatar File Input */}
                        <button
                            type="button"
                            onClick={() => avatarInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95 disabled:opacity-50"
                            title="Change photo"
                        >
                            <Camera className="w-4 h-4"/>
                        </button>

                        <input
                            type="file"
                            ref={avatarInputRef}
                            onChange={(e) => handleFileSelected(e, 'avatar')}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    <div className="text-center sm:text-left flex-1">
                        <h2 className="text-xl font-bold text-slate-900">
                            {formData.firstName} {formData.lastName}
                        </h2>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{formData.role}</p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                            <span
                                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                <Building className="w-3.5 h-3.5 text-slate-400"/>
                                {formData.department}
                            </span>
                            <span
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-500"/>
                                Verified User
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Personal Information Fields */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"/>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"/>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Digital Signature Section */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                <FileSignature className="w-4 h-4 text-blue-600"/>
                                Digital Signature
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Upload a scanned signature for automated document processing.
                            </p>
                        </div>
                    </div>

                    <div
                        className="p-4 rounded-2xl bg-slate-50/80 border border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[160px] relative">
                        {isUploadingSignature ? (
                            <div className="flex flex-col items-center gap-2 text-slate-500">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600"/>
                                <span className="text-xs font-bold">Processing signature...</span>
                            </div>
                        ) : formData.signatureUrl ? (
                            <div className="w-full flex flex-col items-center gap-3">
                                <div
                                    className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs max-w-md w-full flex justify-center">
                                    <img
                                        src={formData.signatureUrl}
                                        alt="Digital Signature"
                                        className="max-h-24 object-contain"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => signatureInputRef.current?.click()}
                                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-1.5"
                                    >
                                        <Upload className="w-3.5 h-3.5 text-slate-500"/> Replace
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeleteSignature}
                                        className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100 transition-all flex items-center gap-1.5"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-rose-500"/> Delete
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <FileSignature className="w-10 h-10 text-slate-300 mx-auto mb-2"/>
                                <p className="text-xs font-semibold text-slate-600 mb-3">No signature uploaded yet</p>
                                <button
                                    type="button"
                                    onClick={() => signatureInputRef.current?.click()}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-2"
                                >
                                    <Upload className="w-3.5 h-3.5"/> Upload Signature
                                </button>
                            </div>
                        )}

                        <input
                            type="file"
                            ref={signatureInputRef}
                            onChange={(e) => handleFileSelected(e, 'signature')}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </div>

                {/* 4. Action Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 disabled:opacity-50 active:scale-98"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin"/> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4"/> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* 5. Image Crop Modal */}
            {cropModal.isOpen && (
                <ImageCropModal
                    imageSrc={cropModal.imageSrc}
                    aspect={cropModal.aspect}
                    title={cropModal.title}
                    onCropComplete={handleCropComplete}
                    onClose={() => setCropModal((prev) => ({...prev, isOpen: false}))}
                />
            )}
        </div>
    );
}