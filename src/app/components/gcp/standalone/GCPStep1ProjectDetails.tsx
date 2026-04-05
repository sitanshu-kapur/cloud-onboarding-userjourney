import { useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Stepper } from "../../Stepper";
import { GCPStandaloneFormData, GCP_STANDALONE_STEPS, LABEL_OPTIONS, TAG_OPTIONS } from "../../../types";

const PROJECT_ID_REGEX = /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/;

function FieldLabel({ label, required, tooltip }: { label: string; required?: boolean; tooltip?: string }) {
  return (
    <label className="flex items-center gap-1.5 text-sm text-[#1E293B] mb-1.5">
      {required && <span className="text-[#EF4444]">*</span>}
      {label}
      {tooltip && <span title={tooltip}><Info size={13} className="text-[#94A3B8] cursor-help" /></span>}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, error, mono }: { value: string; onChange: (v: string) => void; placeholder?: string; error?: string; mono?: boolean }) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10 ${mono ? "font-mono" : ""} ${error ? "border-[#EF4444]" : "border-[#E2E8F0] hover:border-[#93C5FD]"}`}
      />
      {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
    </div>
  );
}

interface Props {
  formData: GCPStandaloneFormData;
  onUpdate: (u: Partial<GCPStandaloneFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export function GCPStep1ProjectDetails({ formData, onUpdate, onNext, onBack, onCancel }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.displayName.trim()) errs.displayName = "Display name is required";
    if (!formData.projectId.trim()) errs.projectId = "Project ID is required";
    else if (!PROJECT_ID_REGEX.test(formData.projectId.trim()))
      errs.projectId = "Must be 6–30 chars, lowercase letters, digits, and hyphens";
    if (!formData.projectNumber.trim()) errs.projectNumber = "Project number is required";
    else if (!/^\d{8,12}$/.test(formData.projectNumber.trim()))
      errs.projectNumber = "Must be an 8–12 digit numeric project number";
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onNext();
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={GCP_STANDALONE_STEPS} currentStep={0} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Project Details</h2>
          <p className="text-sm text-[#64748B] mb-7">
            Enter the details for the GCP project you want to connect.
          </p>

          <div className="flex flex-col gap-5">
            <div>
              <FieldLabel label="Display Name" required />
              <TextInput
                value={formData.displayName}
                onChange={(v) => { onUpdate({ displayName: v }); setErrors((e) => ({ ...e, displayName: "" })); }}
                placeholder="Name shown in AccuKnox UI"
                error={errors.displayName}
              />
            </div>

            <div>
              <FieldLabel label="GCP Project ID" required tooltip="Found in Google Cloud Console → project selector dropdown" />
              <TextInput
                value={formData.projectId}
                onChange={(v) => { onUpdate({ projectId: v.toLowerCase() }); setErrors((e) => ({ ...e, projectId: "" })); }}
                placeholder="my-project-id"
                error={errors.projectId}
                mono
              />
              <p className="text-xs text-[#64748B] mt-1">Lowercase letters, digits, hyphens. 6–30 characters.</p>
            </div>

            <div>
              <FieldLabel label="GCP Project Number" required tooltip="Found in Google Cloud Console → Dashboard → Project info card" />
              <TextInput
                value={formData.projectNumber}
                onChange={(v) => { onUpdate({ projectNumber: v }); setErrors((e) => ({ ...e, projectNumber: "" })); }}
                placeholder="123456789012"
                error={errors.projectNumber}
                mono
              />
              <p className="text-xs text-[#64748B] mt-1">Numeric ID, distinct from Project ID.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Label" />
                <select value={formData.label} onChange={(e) => onUpdate({ label: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm text-[#1E293B] outline-none hover:border-[#93C5FD] focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10">
                  <option value="">Select label</option>
                  {LABEL_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel label="Tag" />
                <select value={formData.tag} onChange={(e) => onUpdate({ tag: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm text-[#1E293B] outline-none hover:border-[#93C5FD] focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10">
                  <option value="">Select tag</option>
                  {TAG_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1 px-5 py-2 rounded-lg border border-[#4285F4] text-[#4285F4] bg-white text-sm hover:bg-[#E8F0FE] transition-colors">
            <ChevronLeft size={15} />Back
          </button>
          <button onClick={onCancel} className="px-5 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] bg-white text-sm hover:bg-[#F8FAFC] transition-colors">Cancel</button>
        </div>
        <button onClick={handleNext} className="px-6 py-2 rounded-lg bg-[#4285F4] text-white text-sm hover:bg-[#3367D6] shadow-sm hover:shadow-md transition-all flex items-center gap-2">
          Continue<ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
