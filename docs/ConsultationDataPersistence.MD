# Consultation Data Persistence

## Overview

Appointment details are stored on the appointment record. When a clinician finalizes a consultation, the application
saves the consultation form data, prescription entries, and completion timestamp together with the appointment. The
data is tagged with its consultation type (`ENT`, `Follow-up`, `Opta`, `Medicine`, `OB`, `Pedia`, or `Referral`) so
each appointment retains the matching form's data.

## Database

In the configured `clinicdb` MySQL database, consultation data is stored in
`appointments.consultation_data` as a JSON document. Hibernate's existing `spring.jpa.hibernate.ddl-auto=update`
setting adds the column to existing installations. The chief complaint is also copied to `appointments.reason` so it
appears consistently in appointment lists and when a consultation is reopened. Scheduled appointment time is stored
separately in `appointments.appointment_date`; dates entered in a consultation form are included in the JSON `fields`
object. No consultation fields are added to the patient record.

Example value:

```json
{
  "type": "ENT",
  "fields": {
    "step1": {
      "hpi": { "type": "textarea", "value": "Symptoms began last week." }
    }
  },
  "prescriptions": [
    { "id": 1, "med": "Example medication", "dose": "1 tablet", "freq": "daily", "duration": "5 days" }
  ],
  "attachments": [],
  "completedAt": "2026-10-31T12:00:00.000Z"
}
```

`fields` contains values organized by form step and field name; checkbox and radio entries also include their checked
state, so both checked and unchecked selections are restored. The backend returns this JSON when appointments are
loaded and accepts it through the appointment update endpoint.

## Save and resume

1. Consultation fields (including complaints, clinical notes, vitals, and checkbox selections) are editable. The form
   captures text, select, and checkbox values as the clinician changes them and moves through each step.
2. **Save Progress** is available on every consultation step. It sends the current form snapshot to
   `PUT /api/appointments/{id}` as `consultationData`, preserves the appointment status, and leaves the consultation
   open. A success message confirms that the progress was saved.
3. **Save & Close Consult** is also available on every step. It saves the same snapshot, marks the appointment
   `COMPLETED`, and closes the consultation.
4. Opening a saved consultation restores its captured field values. Editing a field does not cause the form to
   re-render and lose focus. An API error leaves the window open and displays an error message so the clinician can
   retry.
5. Closing a consultation with unsaved edits opens a confirmation dialog. **Save Progress & Close** persists the
   current snapshot without marking the appointment complete; **Discard & Close** exits without saving; **Continue
   Editing** returns to the consultation.

Appointment creation and scheduling remain unchanged. Consultation data is written only when the clinician finalizes
the consultation.

## Current boundaries

- The attachment panel is currently a placeholder, so the `attachments` array is empty until file-upload persistence
  is implemented.
- Prescription data is stored as structured medication, dose, frequency, and duration entries.
- The form snapshot records UI fields by their label or placeholder. Renaming or rearranging form controls should be
  reviewed for compatibility with saved consultation data.
