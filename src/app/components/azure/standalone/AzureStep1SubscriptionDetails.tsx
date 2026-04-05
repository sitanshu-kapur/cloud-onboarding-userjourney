import { useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Stepper } from "../../Stepper";
import { AzureStandaloneFormData, AZURE_STANDALONE_STEPS, LABEL_OPTIONS, TAG_OPTIONS } from "../../../types";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function FieldLabel({ label, required, tooltip }: { label: string; required?: boolean; tooltip?: string }) {
  return (
    <label className="flex items-center gap-1.5 text-sm text-[#1E293B] mb-1.5">
      {required && <span className="text-[#EF4444]">*</span>}
      {label}
      {tooltip && (
        <span title={tooltip}>
          <Info size={13} className="text-[#94A3B8] cursor-help" />
        </span>
      )}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  error,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/10 ${
          mono ? "font-mono" : ""
        } ${error ? "border-[#EF4444]" : "border-[#E2E8F0] hover:border-[#6CB4F0]"}`}
      />
      {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
    </div>
  );
}

function SimpleSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm text-[#1E293B] outline-none hover:border-[#6CB4F0] focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/10 appearance-none"
      >
        <option value="">{placeholder ?? "Select…"}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Info size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none opacity-0" />
    </div>
  );
}

interface Props {
  formData: AzureStandaloneFormData;
  onUpdate: (u: Partial<AzureStandaloneFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export function AzureStep1SubscriptionDetails({ formData, onUpdate, onNext, onBack, onCancel }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.displayName.trim()) errs.displayName = "Display name is required";
    if (!formData.subscriptionId.trim()) errs.subscriptionId = "Subscription ID is required";
    else if (!UUID_REGEX.test(formData.subscriptionId.trim()))
      errs.subscriptionId = "Must be a valid UUID (e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)";
    if (!formData.tenantId.trim()) errs.tenantId = "Tenant ID is required";
    else if (!UUID_REGEX.test(formData.tenantId.trim()))
      errs.tenantId = "Must be a valid UUID (e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)";
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onNext();
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={AZURE_STANDALONE_STEPS} currentStep={0} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Subscription Details</h2>
          <p className="text-sm text-[#64748B] mb-7">
            Enter the details for the Azure subscription you want to connect.
          </p>

          <div className="flex flex-col gap-5">
            {/* Display Name */}
            <div>
              <FieldLabel label="Display Name" required />
              <TextInput
                value={formData.displayName}
                onChange={(v) => { onUpdate({ displayName: v }); setErrors((e) => ({ ...e, displayName: "" })); }}
                placeholder="Name shown in AccuKnox UI"
                error={errors.displayName}
              />
            </div>

            {/* Subscription ID */}
            <div>
              <FieldLabel
                label="Azure Subscription ID"
                required
                tooltip="Found in Azure Portal → Subscriptions"
              />
              <TextInput
                value={formData.subscriptionId}
                onChange={(v) => { onUpdate({ subscriptionId: v }); setErrors((e) => ({ ...e, subscriptionId: "" })); }}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                error={errors.subscriptionId}
                mono
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

            {/* Label & Tag */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Label" />
                <SimpleSelect
                  options={LABEL_OPTIONS}
                  value={formData.label}
                  onChange={(v) => onUpdate({ label: v })}
                  placeholder="Select label"
                />
              </div>
              <div>
                <FieldLabel label="Tag" />
                <SimpleSelect
                  options={TAG_OPTIONS}
                  value={formData.tag}
                  onChange={(v) => onUpdate({ tag: v })}
                  placeholder="Select tag"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-5 py-2 rounded-lg border border-[#0078D4] text-[#0078D4] bg-white text-sm hover:bg-[#EFF6FF] transition-colors"
          >
            <ChevronLeft size={15} />
            Back
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] bg-white text-sm hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
        </div>
        <button
          onClick={handleNext}
          className="px-6 py-2 rounded-lg bg-[#0078D4] text-white text-sm hover:bg-[#106EBE] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          Continue
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
