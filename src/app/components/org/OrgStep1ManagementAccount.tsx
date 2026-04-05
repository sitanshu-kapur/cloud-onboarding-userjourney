import { useState, useRef, useEffect } from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Info,
  Building2,
  Clipboard,
} from "lucide-react";
import { Stepper } from "../Stepper";
import { OrgFormData, ORG_STEPS, MOCK_MANAGEMENT_ACCOUNTS } from "../../types";

function FieldLabel({
  label,
  required,
  tooltip,
}: {
  label: string;
  required?: boolean;
  tooltip?: string;
}) {
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

function HelperText({ text }: { text: string }) {
  return <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{text}</p>;
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
        className={`w-full px-3 py-2 border rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 ${
          mono ? "font-mono" : ""
        } ${error ? "border-[#EF4444]" : "border-[#E2E8F0] hover:border-[#93C5FD]"}`}
      />
      {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
    </div>
  );
}

function AccountDropdown({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = MOCK_MANAGEMENT_ACCOUNTS.find((a) => a.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-white text-sm transition-colors ${
          error
            ? "border-[#EF4444]"
            : open
            ? "border-[#2563EB] ring-2 ring-[#2563EB]/10"
            : "border-[#E2E8F0] hover:border-[#93C5FD]"
        }`}
      >
        <span className={selected ? "text-[#1E293B]" : "text-[#94A3B8]"}>
          {selected ? `${selected.name} (${selected.id})` : "Select from onboarded accounts"}
        </span>
        <ChevronDown
          size={15}
          className={`text-[#94A3B8] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1">
          {MOCK_MANAGEMENT_ACCOUNTS.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => {
                onChange(acc.id);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 transition-colors hover:bg-[#F8FAFC] ${
                value === acc.id ? "bg-[#EFF6FF]" : ""
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  value === acc.id ? "text-[#2563EB]" : "text-[#1E293B]"
                }`}
              >
                {acc.name}
              </p>
              <p className="text-xs text-[#64748B] mt-0.5 font-mono">{acc.id}</p>
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
    </div>
  );
}

interface Step1Props {
  formData: OrgFormData;
  onUpdate: (updates: Partial<OrgFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export function OrgStep1ManagementAccount({
  formData,
  onUpdate,
  onNext,
  onBack,
  onCancel,
}: Step1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const switchMethod = (method: OrgFormData["managementMethod"]) => {
    onUpdate({ managementMethod: method, managementAccountId: "", managementRoleArn: "" });
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (formData.managementMethod === "select") {
      if (!formData.managementAccountId)
        errs.managementAccountId = "Please select a management account";
    } else {
      if (!formData.managementAccountId.trim())
        errs.managementAccountId = "Management Account ID is required";
      else if (!/^\d{12}$/.test(formData.managementAccountId.trim()))
        errs.managementAccountId = "Must be a 12-digit AWS Account ID";

      if (!formData.managementRoleArn.trim())
        errs.managementRoleArn = "Management Role ARN is required";
      else if (!/^arn:aws[a-z-]*:iam::\d{12}:role\/.+$/.test(formData.managementRoleArn.trim()))
        errs.managementRoleArn =
          "Must be a valid IAM Role ARN, e.g. arn:aws:iam::123456789012:role/RoleName";
    }

    if (!formData.awsOrgId.trim()) errs.awsOrgId = "AWS Org ID is required";
    else if (!/^o-[a-z0-9]{10,32}$/.test(formData.awsOrgId.trim()))
      errs.awsOrgId = "Must be a valid Org ID starting with o-";

    if (!formData.iamRoleName.trim()) errs.iamRoleName = "IAM Role Name is required";

    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onNext();
  };

  const isInline = formData.managementMethod === "inline";

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={ORG_STEPS} currentStep={0} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Management Account</h2>
          <p className="text-sm text-[#64748B] mb-5">
            Configure the management account for your AWS Organization.
          </p>

          {/* Method toggle */}
          <div className="flex rounded-xl border border-[#E2E8F0] overflow-hidden mb-6 bg-[#F8FAFC] p-1 gap-1">
            <button
              type="button"
              onClick={() => switchMethod("select")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                !isInline
                  ? "bg-white text-[#2563EB] shadow-sm border border-[#E2E8F0]"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              <Building2 size={14} />
              Select onboarded account
            </button>
            <button
              type="button"
              onClick={() => switchMethod("inline")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                isInline
                  ? "bg-white text-[#2563EB] shadow-sm border border-[#E2E8F0]"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              <Clipboard size={14} />
              Paste Role ARN directly
            </button>
          </div>

          {/* Context banner — only shown for select method */}
          {!isInline && (
            <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] border-l-4 border-l-[#F59E0B] rounded-lg p-4 mb-6">
              <AlertTriangle size={17} className="text-[#D97706] shrink-0 mt-0.5" />
              <p className="text-sm text-[#92400E]">
                The selected account must already be onboarded to AccuKnox as a standalone account
                and marked as a management account. Org onboarding will deploy a StackSet from it.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-5">
            {/* Method-specific fields */}
            {!isInline ? (
              <div>
                <FieldLabel label="Management Account" required />
                <AccountDropdown
                  value={formData.managementAccountId}
                  onChange={(v) => {
                    onUpdate({ managementAccountId: v });
                    setErrors((e) => ({ ...e, managementAccountId: "" }));
                  }}
                  error={errors.managementAccountId}
                />
                <HelperText text="This must be an account already onboarded to AccuKnox and marked as a management account." />
              </div>
            ) : (
              <>
                <div>
                  <FieldLabel
                    label="Management Account ID"
                    required
                    tooltip="Your 12-digit AWS management account identifier"
                  />
                  <TextInput
                    value={formData.managementAccountId}
                    onChange={(v) => {
                      onUpdate({ managementAccountId: v });
                      setErrors((e) => ({ ...e, managementAccountId: "" }));
                    }}
                    placeholder="123456789012"
                    error={errors.managementAccountId}
                  />
                  <HelperText text="The 12-digit ID of the AWS account that manages your organization." />
                </div>

                <div>
                  <FieldLabel label="Management Role ARN" required />
                  <TextInput
                    value={formData.managementRoleArn}
                    onChange={(v) => {
                      onUpdate({ managementRoleArn: v });
                      setErrors((e) => ({ ...e, managementRoleArn: "" }));
                    }}
                    placeholder="arn:aws:iam::123456789012:role/AccuKnox-CrossAccount-Role"
                    error={errors.managementRoleArn}
                    mono
                  />
                  <HelperText text="The ARN of the AccuKnox cross-account IAM role already deployed in your management account." />
                </div>
              </>
            )}

            {/* AWS Org ID — always shown */}
            <div>
              <FieldLabel
                label="AWS Org ID"
                required
                tooltip="Found in AWS Console → Organizations → Settings"
              />
              <TextInput
                value={formData.awsOrgId}
                onChange={(v) => {
                  onUpdate({ awsOrgId: v });
                  setErrors((e) => ({ ...e, awsOrgId: "" }));
                }}
                placeholder="o-xxxxxxxxxx"
                error={errors.awsOrgId}
              />
              <HelperText text="Your Organization ID starts with o- and can be found in AWS Console → Organizations → Settings." />
            </div>

            {/* IAM Role Name — always shown */}
            <div>
              <FieldLabel label="IAM Role Name" required />
              <TextInput
                value={formData.iamRoleName}
                onChange={(v) => {
                  onUpdate({ iamRoleName: v });
                  setErrors((e) => ({ ...e, iamRoleName: "" }));
                }}
                placeholder="AccuKnox-CrossAccount-Role"
                error={errors.iamRoleName}
              />
              <HelperText text="This role will be deployed into every member account via StackSet." />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-5 py-2 rounded-lg border border-[#2563EB] text-[#2563EB] bg-white text-sm hover:bg-[#EFF6FF] transition-colors"
          >
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
          className="px-6 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:bg-[#1D4ED8] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          Continue
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
