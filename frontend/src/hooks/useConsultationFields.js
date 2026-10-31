import { useCallback, useLayoutEffect, useRef } from "react";

const getFieldsForAppointment = (appointment) =>
  appointment.consultationData?.fields || {};

const getControlKey = (control, index, duplicates) => {
  const explicitName = control.getAttribute("name") || control.id;
  const label =
    control.closest("label")?.textContent ||
    Array.from(control.parentElement?.children || []).find(
      (child) => child.tagName === "LABEL",
    )?.textContent;
  const baseName = (explicitName || label || control.placeholder || `field-${index}`)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const duplicateNumber = duplicates.get(baseName) || 0;
  duplicates.set(baseName, duplicateNumber + 1);
  return duplicateNumber ? `${baseName}-${duplicateNumber + 1}` : baseName;
};

export default function useConsultationFields(visitData, currentStep) {
  const initialFields = getFieldsForAppointment(visitData);
  const rootRef = useRef(null);
  const fieldsRef = useRef(initialFields);

  const getControls = useCallback(
    () => {
      const controls = Array.from(
        rootRef.current?.querySelectorAll(
          'input:not([type="button"]):not([type="submit"]), textarea, select',
        ) || [],
      );
      const duplicates = new Map();
      return controls.map((control, index) => ({
        control,
        key: getControlKey(control, index, duplicates),
      }));
    },
    [],
  );

  const captureCurrentStep = useCallback(() => {
    const values = Object.fromEntries(
      getControls()
        .map(({ control, key }) => {
          if (control.readOnly || control.disabled || control.type === "file") return null;
          if (control.type === "checkbox" || control.type === "radio") {
            return [key, { type: control.type, checked: control.checked, value: control.value }];
          }
          return [key, { type: control.type, value: control.value }];
        })
        .filter(Boolean),
    );
    const updatedFields = { ...fieldsRef.current, [`step${currentStep}`]: values };
    fieldsRef.current = updatedFields;
    return updatedFields;
  }, [currentStep, getControls]);

  const buildConsultationData = useCallback((type, prescriptions, attachments) => {
    const updatedFields = captureCurrentStep();
    const chiefComplaint = updatedFields.step1?.["chief-complaint"]?.value;
    return {
      type,
      fields: updatedFields,
      ...(chiefComplaint !== undefined ? { chiefComplaint } : {}),
      prescriptions,
      attachments,
      completedAt: new Date().toISOString(),
    };
  }, [captureCurrentStep]);

  useLayoutEffect(() => {
    const savedValues = fieldsRef.current[`step${currentStep}`];
    if (!savedValues) return;
    getControls().forEach(({ control, key }) => {
      const saved = savedValues[key];
      if (!saved || control.readOnly || control.disabled || control.type === "file") return;
      if (control.type === "checkbox" || control.type === "radio") {
        control.checked = saved.checked;
      } else {
        control.value = saved.value ?? "";
      }
    });
  }, [currentStep, getControls]);

  return {
    rootRef,
    captureCurrentStep,
    buildConsultationData,
  };
}
