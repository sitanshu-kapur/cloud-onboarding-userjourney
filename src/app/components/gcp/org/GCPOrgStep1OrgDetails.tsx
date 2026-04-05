import { useState } from "react";
import { ChevronLeft, ChevronRight, Info, AlertTriangle } from "lucide-react";
import { Stepper } from "../../Stepper";
import { GCPOrgFormData, GCP_ORG_STEPS } from "../../../types";

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
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10 ${mono ? "font-mono" : ""} ${error ? "border-[#EF4444]" : "border-[#E2E8F0] hover:border-[#93C5FD]"}`} />
      {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
    </div>
  );
}

interface Props {
  formData: GCPOrgFormData;
  onUpdate: (u: Partial<GCPOrgFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export function GCPOrgStep1OrgDetails({ formData, onUpdate, onNext, onBack, onCancel }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.orgId.trim()) errs.orgId = "Organization ID is required";
    else if (!/^\d{10,12}$/.test(formData.orgId.trim())) errs.orgId = "Must be a 10–12 digit numeric Organization ID";
    if (!formData.orchestratorProjectId.trim()) errs.orchestratorProjectId = "Orchestrator Project ID is required";
    else if (!PROJECT_ID_REGEX.test(formData.orchestratorProjectId.trim())) errs.orchestratorProjectId = "Must be 6–30 chars, lowercase letters, digits, and hyphens";
    if (!formData.orchestratorProjectNumber.trim()) errs.orchestratorProjectNumber = "Orchestrator Project Number is required";
    else if (!/^\d{8,12}$/.test(formData.orchestratorProjectNumber.trim())) errs.orchestratorProjectNumber = "Must be an 8–12 digit numeric project number";
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onNext();
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={GCP_ORG_STEPS} currentStep={0} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Organization Details</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Provide your GCP Organization ID and designate an Orchestrator Project that will host the
            Workload Identity Federation infrastructure.
          </p>

          <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] border-l-4 border-l-[#F59E0B] rounded-lg p-4 mb-6">
            <AlertTriangle size={17} className="text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-sm text-[#92400E]">
              <span className="font-medium">Organization Admin required.</span> The account used to run
              the provisioning script must have Organization Admin permissions on this GCP organization.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <FieldLabel label="Organization Display Name" />
              <TextInput value={formData.displayName} onChange={(v) => onUpdate({ displayName: v })} placeholder="e.g. Acme Corp GCP Organization" />
            </div>

            <div>
              <FieldLabel label="GCP Organization ID" required tooltip="Found in Google Cloud Console → IAM & Admin → Settings, or in the resource hierarchy" />
              <TextInput value={formData.orgId} onChange={(v) => { onUpdate({ orgId: v }); setErrors((e) => ({ ...e, orgId: "" })); }} placeholder="123456789012" error={errors.orgId} mono />
              <div className="flex items-start gap-2 mt-1.5">
                <Info size={13} className="text-[#94A3B8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B]">Google Cloud Console → IAM & Admin → Settings → Organization ID.</p>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <p className="text-sm font-medium text-[#1E293B] mb-1">Orchestrator Project</p>
              <p className="text-xs text-[#64748B] mb-4 leading-relaxed">
                The Orchestrator Project hosts the Workload Identity Pool, Pub/Sub topic, and service
                account. All org-level IAM bindings are placed here.
              </p>
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel label="Orchestrator Project ID" required tooltip="The GCP project that will host AccuKnox's WIF infrastructure" />
                  <TextInput value={formData.orchestratorProjectId} onChange={(v) => { onUpdate({ orchestratorProjectId: v.toLowerCase() }); setErrors((e) => ({ ...e, orchestratorProjectId: "" })); }} placeholder="accuknox-orchestrator" error={errors.orchestratorProjectId} mono />
                </div>
                <div>
                  <FieldLabel label="Orchestrator Project Number" required />
                  <TextInput value={formData.orchestratorProjectNumber} onChange={(v) => { onUpdate({ orchestratorProjectNumber: v }); setErrors((e) => ({ ...e, orchestratorProjectNumber: "" })); }} placeholder="123456789012" error={errors.orchestratorProjectNumber} mono />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1 px-5 py-2 rounded-lg border border-[#4285F4] text-[#4285F4] bg-white text-sm hover:bg-[#E8F0FE] transition-colors"><ChevronLeft size={15} />Back</button>
          <button onClick={onCancel} className="px-5 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] bg-white text-sm hover:bg-[#F8FAFC] transition-colors">Cancel</button>
        </div>
        <button onClick={handleNext} className="px-6 py-2 rounded-lg bg-[#4285F4] text-white text-sm hover:bg-[#3367D6] shadow-sm hover:shadow-md transition-all flex items-center gap-2">
          Continue<ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
