import React from "react";
import { Save, CheckCircle2 } from "lucide-react";

const ConsultationSaveActions = ({ onSaveProgress, onSave, saving = false }) => (
  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
    <button
      type="button"
      onClick={onSaveProgress}
      disabled={saving}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
    >
      <Save size={15} />
      {saving ? "Saving..." : "Save Progress"}
    </button>
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition hover:bg-green-700 disabled:cursor-wait disabled:opacity-60"
    >
      <CheckCircle2 size={15} />
      Save &amp; Close Consult
    </button>
  </div>
);

export default ConsultationSaveActions;
