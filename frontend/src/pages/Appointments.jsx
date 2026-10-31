import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Plus,
  Search,
  ChevronRight,
  X,
  User,
  Trash2,
} from "lucide-react";
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from "../services/appointmentService";
import { getPatients } from "../services/patientService";

import FollowupConsultDetails from "./subpages/FollowupConsultDetails";
import OptaConsultDetails from "./subpages/OptaConsultDetails";
import ENTConsultDetails from "./subpages/ENTConsultDetails";
import MedicineConsultDetails from "./subpages/MedicineConsultDetails";
import OBConsultDetails from "./subpages/OBConsultDetails";
import PediaConsultDetails from "./subpages/PediaConsultDetails";
import ReferralConsultDetails from "./subpages/ReferralConsultDetails";

const consultationTypes = ["ENT", "Follow-up", "Opta", "Medicine", "OB", "Pedia", "Referral"];

const toAppointmentView = (appointment) => {
  const date = new Date(appointment.appointmentDate);
  const patient = appointment.patient || {};
  const patientName = [patient.givenName || patient.firstName, patient.middleName, patient.familyName || patient.lastName]
    .filter(Boolean)
    .join(" ");

  return {
    ...appointment,
    id: appointment.id ?? appointment.appointmentId,
    patient: patientName || "Unknown Patient",
    type: appointment.consultationType || "Medicine",
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: date.toLocaleDateString(),
    complaint: appointment.reason || "No notes",
  };
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [consultationError, setConsultationError] = useState("");
  const [consultationSavedMessage, setConsultationSavedMessage] = useState("");
  const [savingConsultation, setSavingConsultation] = useState(false);
  const [consultationDirty, setConsultationDirty] = useState(false);
  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false);
  const consultationSnapshotRef = useRef(null);
  const [formData, setFormData] = useState({
    patientId: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    appointmentDate: "",
    consultationType: "Medicine",
    reason: "",
    status: "SCHEDULED",
  });

  const loadData = useCallback(async () => {
    setLoadError("");
    try {
      const [appointmentResponse, patientResponse] = await Promise.all([
        getAppointments(),
        getPatients(),
      ]);
      setAppointments((appointmentResponse.data || []).map(toAppointmentView));
      setPatients(patientResponse.data || []);
    } catch (error) {
      console.error("Failed to load appointment data", error);
      setLoadError(error.response?.data?.message || "Could not load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateForm = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      gender: "",
      dateOfBirth: "",
      appointmentDate: "",
      consultationType: "Medicine",
      reason: "",
      status: "SCHEDULED",
    });
    setIsNewPatient(false);
    setFormError("");
  };

  const handleAddAppointment = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    const appointmentData = {
      appointmentDate: formData.appointmentDate,
      consultationType: formData.consultationType,
      reason: formData.reason,
      status: formData.status,
      ...(isNewPatient
        ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            email: formData.email || null,
            gender: formData.gender || null,
            dateOfBirth: formData.dateOfBirth || null,
          }
        : { patientId: Number(formData.patientId) }),
    };

    try {
      await createAppointment(appointmentData);
      setIsBookingModalOpen(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Error saving appointment", error);
      setFormError(error.response?.data?.message || "Could not save appointment. Please check the details and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAppointment = async (event, id) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await deleteAppointment(id);
      setAppointments((current) => current.filter((appointment) => appointment.id !== id));
    } catch (error) {
      console.error("Error deleting appointment", error);
      setLoadError(error.response?.data?.message || "Could not delete appointment. Please try again.");
    }
  };

  const handleConsultationSave = async (consultation, closeAfterSave, closeAfterProgressSave = false) => {
    setSavingConsultation(true);
    setConsultationError("");
    setConsultationSavedMessage("");
    try {
      const response = await updateAppointment(selectedAppointment.id, {
        consultationData: consultation.consultationData,
        ...(consultation.consultationData.chiefComplaint !== undefined
          ? { reason: consultation.consultationData.chiefComplaint }
          : {}),
        ...(closeAfterSave ? { status: "COMPLETED" } : {}),
      });
      const updatedAppointment = toAppointmentView(response.data);
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? updatedAppointment
            : appointment,
        ),
      );
      setSelectedAppointment(updatedAppointment);
      setConsultationDirty(false);
      if (closeAfterSave || closeAfterProgressSave) {
        setIsConsultModalOpen(false);
        setShowUnsavedPrompt(false);
      } else {
        setConsultationSavedMessage("Progress saved. You can continue editing this consultation.");
      }
    } catch (error) {
      console.error("Error saving consultation", error);
      setConsultationError(
        error.response?.data?.message || "Could not save consultation. Please try again.",
      );
    } finally {
      setSavingConsultation(false);
    }
  };

  const handleRequestConsultationClose = () => {
    if (consultationDirty) {
      setShowUnsavedPrompt(true);
      return;
    }
    setIsConsultModalOpen(false);
  };

  const handleSaveAndCloseFromPrompt = () => {
    const snapshot = consultationSnapshotRef.current?.();
    if (!snapshot) {
      setConsultationError("Could not read the consultation. Please try saving from the form.");
      return;
    }
    handleConsultationSave(snapshot, false, true);
  };

  const handleDiscardAndClose = () => {
    setConsultationDirty(false);
    setShowUnsavedPrompt(false);
    setIsConsultModalOpen(false);
  };

  const filteredAppointments = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return appointments.filter((appointment) =>
      appointment.patient.toLowerCase().includes(search) ||
      appointment.type.toLowerCase().includes(search) ||
      (appointment.reason || "").toLowerCase().includes(search),
    );
  }, [searchTerm, appointments]);

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    resetForm();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic flex items-center gap-3">
            <Calendar className="text-emerald-600" size={32} />
            Appointments
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage patient bookings and clinical entries.</p>
        </div>
        <button
          onClick={() => {
            setFormError("");
            setIsBookingModalOpen(true);
          }}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <Plus size={18} /> New Appointment
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search patients, consultation type, or notes..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-slate-700"
          />
        </div>
      </div>

      {loadError && <p role="alert" className="mb-4 text-sm text-red-600">{loadError}</p>}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50">
            <tr className="text-left text-[10px] uppercase tracking-widest text-slate-400">
              <th className="px-8 py-4">Patient</th>
              <th className="px-6 py-4 text-center">Consultation</th>
              <th className="px-6 py-4 text-right">Date &amp; Time</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredAppointments.map((appointment) => (
              <tr
                key={appointment.id}
                onClick={() => {
                  setSelectedAppointment(appointment);
                  setConsultationDirty(false);
                  setShowUnsavedPrompt(false);
                  setConsultationError("");
                  setConsultationSavedMessage("");
                  consultationSnapshotRef.current = null;
                  setIsConsultModalOpen(true);
                }}
                className="hover:bg-emerald-50/30 transition-colors cursor-pointer group"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{appointment.patient}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: #{appointment.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="px-4 py-1.5 bg-slate-100 text-[10px] font-black uppercase rounded-xl text-slate-500 border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                    {appointment.type}
                  </span>
                </td>
                <td className="px-6 py-6 text-right">
                  <p className="text-xs font-black text-slate-700">{appointment.time}</p>
                  <p className="text-[10px] text-slate-400">{appointment.date}</p>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="px-3 py-1 bg-emerald-50 text-[10px] font-bold uppercase rounded-full text-emerald-700">
                    {appointment.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button
                    type="button"
                    aria-label={`Delete appointment ${appointment.id}`}
                    onClick={(event) => handleDeleteAppointment(event, appointment.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                  <ChevronRight size={18} className="inline text-slate-300" />
                </td>
              </tr>
            ))}
            {!loading && filteredAppointments.length === 0 && (
              <tr>
                <td colSpan="5" className="px-8 py-12 text-center text-sm text-slate-400">
                  {appointments.length ? "No appointments match your search." : "No appointments have been scheduled."}
                </td>
              </tr>
            )}
            {loading && (
              <tr><td colSpan="5" className="px-8 py-12 text-center text-sm text-slate-400">Loading appointments...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isConsultModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="w-full max-w-5xl max-h-[95vh] overflow-y-auto custom-scrollbar rounded-[2.5rem] pt-12 pb-4 px-4">
            <div className="relative">
              <button
                onClick={handleRequestConsultationClose}
                disabled={savingConsultation}
                aria-label="Close consultation"
                className="absolute -top-6 -right-2 md:-right-4 bg-white p-3 rounded-full shadow-2xl z-[140] hover:bg-slate-50 transition-all cursor-pointer border border-slate-100 flex items-center justify-center active:scale-90"
              >
                <X size={20} className="text-slate-500" />
              </button>
              {(() => {
                const props = {
                  visitData: selectedAppointment,
                  onSave: (consultation) => handleConsultationSave(consultation, true),
                  onSaveProgress: (consultation) => handleConsultationSave(consultation, false),
                  onDirtyChange: () => setConsultationDirty(true),
                  registerConsultationSnapshot: (getSnapshot) => {
                    consultationSnapshotRef.current = getSnapshot;
                  },
                  saving: savingConsultation,
                };
                switch (selectedAppointment.type) {
                  case "Opta": return <OptaConsultDetails key={selectedAppointment.id} {...props} />;
                  case "Follow-up": return <FollowupConsultDetails key={selectedAppointment.id} {...props} />;
                  case "ENT": return <ENTConsultDetails key={selectedAppointment.id} {...props} />;
                  case "Medicine": return <MedicineConsultDetails key={selectedAppointment.id} {...props} />;
                  case "OB": return <OBConsultDetails key={selectedAppointment.id} {...props} />;
                  case "Pedia": return <PediaConsultDetails key={selectedAppointment.id} {...props} />;
                  case "Referral": return <ReferralConsultDetails key={selectedAppointment.id} {...props} />;
                  default: return (
                    <div className="bg-white p-20 rounded-[2.5rem] text-center border border-slate-100 shadow-xl">
                      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                        Clinical Form for {selectedAppointment.type} coming soon
                      </p>
                    </div>
                  );
                }
              })()}
              {consultationError && (
                <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {consultationError}
                </p>
              )}
              {consultationSavedMessage && !savingConsultation && (
                <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {consultationSavedMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {showUnsavedPrompt && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/70 p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="unsaved-consultation-title"
          aria-describedby="unsaved-consultation-description"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="unsaved-consultation-title" className="text-lg font-black text-slate-900">
              Unsaved consultation changes
            </h2>
            <p id="unsaved-consultation-description" className="mt-2 text-sm text-slate-600">
              You have changes that have not been saved. Would you like to save them before closing?
            </p>
            {consultationError && (
              <p role="alert" className="mt-3 text-sm text-red-600">{consultationError}</p>
            )}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowUnsavedPrompt(false)}
                disabled={savingConsultation}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Continue Editing
              </button>
              <button
                type="button"
                onClick={handleDiscardAndClose}
                disabled={savingConsultation}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                Discard &amp; Close
              </button>
              <button
                type="button"
                onClick={handleSaveAndCloseFromPrompt}
                disabled={savingConsultation}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {savingConsultation ? "Saving..." : "Save Progress & Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-slate-900">Create Appointment</h2>
              <button type="button" onClick={closeBookingModal} aria-label="Close appointment form">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isNewPatient}
                  onChange={(event) => setIsNewPatient(event.target.checked)}
                />
                Patient not registered yet (Create New)
              </label>

              {isNewPatient ? (
                <div className="space-y-3 rounded-xl border-y py-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">New Patient Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={updateForm("firstName")}
                      className="w-full rounded-lg border p-2 text-sm"
                    />
                    <input
                      required
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={updateForm("lastName")}
                      className="w-full rounded-lg border p-2 text-sm"
                    />
                  </div>
                  <input
                    required
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={updateForm("phone")}
                    className="w-full rounded-lg border p-2 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={formData.email}
                      onChange={updateForm("email")}
                      className="w-full rounded-lg border p-2 text-sm"
                    />
                    <select
                      value={formData.gender}
                      onChange={updateForm("gender")}
                      className="w-full rounded-lg border p-2 text-sm"
                    >
                      <option value="">Gender (optional)</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <label className="block text-xs font-medium text-slate-600">
                    Date of birth (optional)
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={updateForm("dateOfBirth")}
                      className="mt-1 w-full rounded-lg border p-2 text-sm"
                    />
                  </label>
                </div>
              ) : (
                <label className="block text-sm font-medium text-slate-700">
                  Select Existing Patient
                  <select
                    required
                    value={formData.patientId}
                    onChange={updateForm("patientId")}
                    className="mt-1 block w-full rounded-lg border border-slate-300 p-2"
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {[patient.familyName || patient.lastName, patient.givenName || patient.firstName]
                          .filter(Boolean)
                          .join(", ")} ({patient.mobileNumber || "No phone"})
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="block text-sm font-medium text-slate-700">
                Consultation Type
                <select
                  required
                  value={formData.consultationType}
                  onChange={updateForm("consultationType")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-2"
                >
                  {consultationTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Appointment Date &amp; Time
                <input
                  required
                  type="datetime-local"
                  value={formData.appointmentDate}
                  onChange={updateForm("appointmentDate")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-2"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Reason / Notes
                <textarea
                  value={formData.reason}
                  onChange={updateForm("reason")}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-2"
                  rows="3"
                />
              </label>

              {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeBookingModal} className="rounded-lg border px-4 py-2 text-sm text-slate-600">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
