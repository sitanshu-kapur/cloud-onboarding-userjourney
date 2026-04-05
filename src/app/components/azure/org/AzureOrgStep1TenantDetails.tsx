import { useState } from "react";
import { ChevronLeft, ChevronRight, Info, AlertTriangle } from "lucide-react";
import { Stepper } from "../../Stepper";
import { AzureOrgFormData, AZURE_ORG_STEPS } from "../../../types";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function FieldLabel({ label, required, tooltip }: { label: string; required?: boolean; tooltip?: string }) {
  return (
    <label className="flex items-center gap-1.5 text-sm text-[#1E293B] mb-1.5">
      {required && <span className="text-[#EF4444]">*</span>}
      {label}
      {tooltip && <span title={tooltip}><Info size={13} className="text-[#94A3B8] cursor-help" /></span>}
    </label>
  );
}

function TextInput({
  value, onChange, placeholder, error, mono,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; error?: string; mono?: boolean;
}) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/10 ${mono ? "font-mono" : ""} ${error ? "border-[#EF4444]" : "border-[#E2E8F0] hover:border-[#6CB4F0]"}`}
      />
      {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
    </div>
  );
}

interface Props {
  formData: AzureOrgFormData;
  onUpdate: (u: Partial<AzureOrgFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export function AzureOrgStep1TenantDetails({ formData, onUpdate, onNext, onBack, onCancel }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.tenantId.trim()) errs.tenantId = "Tenant ID is required";
    else if (!UUID_REGEX.test(formData.tenantId.trim()))
      errs.tenantId = "Must be a valid UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)";
    if (!formData.managementGroupId.trim()) errs.managementGroupId = "Management Group ID is required";
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onNext();
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={AZURE_ORG_STEPS} currentStep={0} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Tenant Details</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Provide the details of your Azure tenant and root Management Group for organization-level
            onboarding.
          </p>

          {/* Global Admin warning */}
          <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] border-l-4 border-l-[#F59E0B] rounded-lg p-4 mb-6">
            <AlertTriangle size={17} className="text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-sm text-[#92400E]">
              <span className="font-medium">Global Administrator required.</span> The account used to
              deploy the Lighthouse ARM template must have Global Administrator access on this Azure
              tenant.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Display Name */}
            <div>
              <FieldLabel label="Organization Display Name" />
              <TextInput
                value={formData.displayName}
                onChange={(v) => onUpdate({ displayName: v })}
                placeholder="e.g. Contoso Azure Organization"
              />
            </div>

            {/* Tenant ID */}
            <div>
              <FieldLabel
                label="Azure Tenant ID"
                required
                tooltip="Found in Azure Portal → Azure Active Directory → Properties"
              />
              <TextInput
                value={formData.tenantId}
                onChange={(v) => { onUpdate({ tenantId: v }); setErrors((e) => ({ ...e, tenantId: "" })); }}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                error={errors.tenantId}
                mono
              />
            </div>

            {/* Management Group ID */}
            <div>
              <FieldLabel
                label="Root Management Group ID"
                required
                tooltip="Found in Azure Portal → Management Groups. The root MG ID is usually your Tenant ID."
              />
              <TextInput
                value={formData.managementGroupId}
                onChange={(v) => { onUpdate({ managementGroupId: v }); setErrors((e) => ({ ...e, managementGroupId: "" })); }}
                placeholder="e.g. mg-root or your Tenant ID"
                error={errors.managementGroupId}
                mono
              />
              <div className="flex items-start gap-2 mt-1.5">
                <Info size={13} className="text-[#94A3B8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B]">
                  Azure Portal → Management Groups → click the root group → Properties to find the ID.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1 px-5 py-2 rounded-lg border border-[#0078D4] text-[#0078D4] bg-white text-sm hover:bg-[#EFF6FF] transition-colors">
            <ChevronLeft size={15} />
            Back
          </button>
          <button onClick={onCancel} className="px-5 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] bg-white text-sm hover:bg-[#F8FAFC] transition-colors">
            Cancel
          </button>
        </div>
        <button onClick={handleNext} className="px-6 py-2 rounded-lg bg-[#0078D4] text-white text-sm hover:bg-[#106EBE] shadow-sm hover:shadow-md transition-all flex items-center gap-2">
          Continue
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
